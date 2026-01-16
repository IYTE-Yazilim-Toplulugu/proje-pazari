export function logRequest(
    method: string,
    url: string,
    data?: any
){
    if (process.env.NODE_ENV !== 'development') return ;

    console.group(`%c${method} ${url}`,
        'color: #0ae5e9; font-weight: bold',
        'color: #64748b'
    );
    if (data){
        console.log('Data:', data);
    }
    console.groupEnd();
}

export function logResponse(
    method: string,
    url: string,
    status: number,
    data?: any
){
    if(process.env.NODE_ENV !== 'development') return;

    const color = status >=200 && status < 300 ? '#10b981' : '#ef4444';
    console.group(`%c${method} ${url} ${status}`,
        'color: #0ae5e9; font-weight: bold',
        'color: #64748b',
        `color: ${color}; font-weight: bold`,
    );
    if (data){
        console.log("Response Data:", data);
    }
    console.groupEnd();
}