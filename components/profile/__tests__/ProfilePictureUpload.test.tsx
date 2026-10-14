import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import ProfilePictureUpload from '../ProfilePictureUpload';

jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

const CURRENT_URL = 'https://api.projepazari.site/api/v1/files/proje-pazari-avatars/users/42/avatar.png';

function selectFile(file: File) {
  const input = screen.getByLabelText('select') as HTMLInputElement;
  fireEvent.change(input, { target: { files: [file] } });
  return input;
}

describe('ProfilePictureUpload', () => {
  const image = () => new File(['avatar'], 'avatar.png', { type: 'image/png' });

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    URL.createObjectURL = jest.fn(() => 'blob:preview');
    URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows the localized error instead of the raw backend message when the upload fails', async () => {
    const onUpload = jest.fn().mockRejectedValue(new Error('Internal: storage bucket missing'));
    render(<ProfilePictureUpload currentUrl={CURRENT_URL} onUpload={onUpload} />);

    selectFile(image());

    expect(await screen.findByRole('alert')).toHaveTextContent('errors.generic');
    expect(screen.queryByText(/storage bucket missing/)).not.toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', CURRENT_URL);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview');
  });

  it('uploads again when the same file is chosen after a failure', async () => {
    const onUpload = jest.fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(undefined);
    render(<ProfilePictureUpload currentUrl={CURRENT_URL} onUpload={onUpload} />);

    const file = image();
    const input = selectFile(file);
    await screen.findByRole('alert');
    expect(input.value).toBe('');

    selectFile(file);
    await waitFor(() => expect(onUpload).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });

  it('shows the preview while uploading and the refreshed picture afterwards', async () => {
    let finishUpload!: () => void;
    const onUpload = jest.fn(() => new Promise<void>(resolve => { finishUpload = resolve; }));
    const { rerender } = render(<ProfilePictureUpload currentUrl={CURRENT_URL} onUpload={onUpload} />);

    selectFile(image());
    expect(screen.getByRole('img')).toHaveAttribute('src', 'blob:preview');
    expect(screen.getByLabelText('select')).toBeDisabled();

    const refreshedUrl = `${CURRENT_URL}?v=1`;
    rerender(<ProfilePictureUpload currentUrl={refreshedUrl} onUpload={onUpload} />);
    finishUpload();

    await waitFor(() => expect(screen.getByRole('img')).toHaveAttribute('src', refreshedUrl));
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview');
  });

  it('rejects non-image files without uploading', () => {
    const onUpload = jest.fn();
    render(<ProfilePictureUpload onUpload={onUpload} />);

    selectFile(new File(['text'], 'notes.txt', { type: 'text/plain' }));

    expect(screen.getByRole('alert')).toHaveTextContent('errors.type');
    expect(onUpload).not.toHaveBeenCalled();
  });
});
