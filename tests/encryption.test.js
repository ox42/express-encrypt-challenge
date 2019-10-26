const encryption = require('../lib/encryption');

describe('Create', () => {
    it('succeeds with valid password', async () => {

        let text = 'something to encode...';
        let password = 'password1';

        let encryptedData = encryption.encrypt(text, password);
        expect(encryptedData).not.toEqual(text);

        let decryptedData = encryption.decrypt(encryptedData, password);
        expect(decryptedData).toEqual(text);
    });

    it('fails with wrong password', async () => {

        let text = 'something to encode...';
        let password = 'password1';

        let encryptedData = encryption.encrypt(text, password);

        expect(() => {
            encryption.decrypt(encryptedData, 'wrongpassword');
        }).toThrow();
    });
});
