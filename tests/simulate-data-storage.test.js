describe('Sign In', () => {
    it('succeeds with valid data and requests', async () => {

        let id = 'string1', encryption_key = '123456', value = 'A random string...';
        const storeResponse = await methods.post(`/data`, { id, encryption_key, value }).expect(200);
        expect(storeResponse.body.status).toEqual('success');

        const fetchResponse = await methods.get(`/data?id=${id}&encryption_key=${encryption_key}`).expect(200);
        expect(fetchResponse.body.status).toEqual('success');
        expect(fetchResponse.body.data.items).toHaveLength(1);
        expect(fetchResponse.body.data.items[0].type).toEqual(typeof value);
        expect(fetchResponse.body.data.items[0].value).toEqual(value);
    });


    it('fails to store data with invalid requests', async () => {

        await methods.post(`/data`, { }).expect(400);
        await methods.post(`/data`, { /* no id */ encryption_key: 'key', value: 'value' }).expect(400);
        await methods.post(`/data`, { id: 'invalid id', encryption_key: 'key', value: 'value' }).expect(400);

        await methods.post(`/data`, { id: 'id1', /* no encryption key */ value: 'value' }).expect(400);
        await methods.post(`/data`, { id: 'id1', encryption_key: 'key' /* no value */ }).expect(400);
    });
});
