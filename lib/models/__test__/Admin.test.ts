import { ChangeFeaturePayloadSchema, FeatureFlagSchema } from '../Admin';

describe('Admin Schemas', () => {

    describe('FeatureFlagSchema', () => {

        it('should validate a correct FeatureFlagSchema payload', () => {
            const validFeatureFlagSchema = {
                Feed: true,
                Company: true,
                Cart: true,
                Payment: true,
                Comment: true,
                Form: true
            };

            expect(() => FeatureFlagSchema.parse(validFeatureFlagSchema)).not.toThrow();
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
