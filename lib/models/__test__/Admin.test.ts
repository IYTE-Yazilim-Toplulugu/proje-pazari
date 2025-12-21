import { ChangeFeaturePayloadSchema, FeatureListSchema } from '../Admin';

describe('Admin Schemas', () => {

    describe('FeatureListSchema', () => {

        it('should validate a correct FeatureListSchema payload', () => {
            const validFeatureListSchema = {
                Feed: true,
                Company: true,
                Cart: true,
                Payment: true,
                Comment: true,
                Form: true
            };

            expect(() => FeatureListSchema.parse(validFeatureListSchema)).not.toThrow();
        });

        it('should validate a correct Change Feature payload', () => {
            const validChangeFeature = {
                key: "Feed",
                enabled: false
            };

            expect(() => ChangeFeaturePayloadSchema.parse(validChangeFeature)).not.toThrow();
        });
    });
});
