const SearchAttributesMiddleware = require('../src/app/middlewares/SearchAttributesMiddleware')
const httpMocks = require('node-mocks-http')

describe('Testing validateJson() function', () => {
    test('Passing the correct body needs to call next()', async() =>{
        expect.assertions(1)
        const req  = httpMocks.createRequest({
            method: 'POST',
            url: '/searchAttributes/values',
            body: {
                "webid": "E0Yfc0jetNdUKgzx5SiPQwKAh-vBfrqz6RGqUA5W_jVX9gRUMyQU1BWi1UMU41RUo1XE9NT1xORVhBIFZBWkFOVEVcTUFMSEFTXFBJREVfNjg",
                "startDateTime": "2019-12-14 15:00:47",
                "endDateTime": "2019-12-15 16:00:47",
                "interval": "00:00:01",
                "attributes": ["Bit Status"],
                "isSubattribute": "false"
            },
            path: "/values"
        });
        const res = httpMocks.createResponse();

        const next = jest.fn();
        await SearchAttributesMiddleware.validateJson(req, res, next)
        expect(next).toHaveBeenCalled()
    })
})

describe('Testing validateSecretKey() function', () => {
    test('Passing only six params in the body and bodyPatternValues should throw a Error', async() =>{
        expect.assertions(2)
        body = {
            webid: "E0Yfc0jetNdUKgzx5SiPQwKAh-vBfrqz6RGqUA5W_jVX9gRUMyQU1BWi1UMU41RUo1XE9NT1xORVhBIFZBWkFOVEVcTUFMSEFTXFBJREVfNjg",
            startDateTime: "2019-12-14 15:00:47",
            endDateTime: "2019-12-15 16:00:47",
            interval: "00:00:01",
            attributes: ["Bit Status"]
        }
        const bodyPatternValues = [
            "webid",
            "attributes",
            "isSubattribute",
            "startDateTime",
            "endDateTime",
            "interval"
        ]
        try{
            await SearchAttributesMiddleware.validateSecretKey(body, bodyPatternValues)
        }catch(err){
            expect(err).toBeInstanceOf(Error)
            expect(err).toHaveProperty('message', 'Devem ser passados 6 parâmetros. Cheque especificação da requisição')
        }
    })
    test('Passing eight params in the body and bodyPatternValues should return throw a Error', async() =>{
        expect.assertions(2)
        body = {
            webid: "E0Yfc0jetNdUKgzx5SiPQwKAh-vBfrqz6RGqUA5W_jVX9gRUMyQU1BWi1UMU41RUo1XE9NT1xORVhBIFZBWkFOVEVcTUFMSEFTXFBJREVfNjg",
            startDateTime: "2019-12-14 15:00:47",
            endDateTime: "2019-12-15 16:00:47",
            interval: "00:00:01",
            attributes: ["Bit Status"],
            isSubattribute: "false",
            variable: "haha"
        }
        const bodyPatternValues = [
            "webid",
            "attributes",
            "isSubattribute",
            "startDateTime",
            "endDateTime",
            "interval"
        ]

        try{
            await SearchAttributesMiddleware.validateSecretKey(body, bodyPatternValues)
        }catch(err){
            expect(err).toBeInstanceOf(Error)
            expect(err).toHaveProperty('message', 'Devem ser passados 6 parâmetros. Cheque especificação da requisição')
        }
    })
})

describe('Testing isPresent() function', () => {
    
    test('Passing a body without webid', () => {
        body = {
            startDateTime: "2019-12-14 15:00:47",
            endDateTime: "2019-12-15 16:00:47",
            interval: "00:00:01",
            attributes: ["Bit Status"],
            isSubattribute: "false",
        }
        expect.assertions(1)
        return expect(SearchAttributesMiddleware.isPresent("webid", body)).rejects.toEqual('Especifique qual WebId quer buscar')
    })
    test('Passing a body without startDateTime', () => {
        body = {
            webid: "E0Yfc0jetNdUKgzx5SiPQwKAh-vBfrqz6RGqUA5W_jVX9gRUMyQU1BWi1UMU41RUo1XE9NT1xORVhBIFZBWkFOVEVcTUFMSEFTXFBJREVfNjg",
            endDateTime: "2019-12-15 16:00:47",
            interval: "00:00:01",
            attributes: ["Bit Status"],
            isSubattribute: "false",
        }
        expect.assertions(1)
        return expect(SearchAttributesMiddleware.isPresent("startDateTime", body)).rejects.toEqual('Especifique o startDateTime')
    })
    test('Passing a body without endDateTime', () => {
        body = {
            webid: "E0Yfc0jetNdUKgzx5SiPQwKAh-vBfrqz6RGqUA5W_jVX9gRUMyQU1BWi1UMU41RUo1XE9NT1xORVhBIFZBWkFOVEVcTUFMSEFTXFBJREVfNjg",
            startDateTime: "2019-12-14 15:00:47",
            interval: "00:00:01",
            attributes: ["Bit Status"],
            isSubattribute: "false",
        }
        expect.assertions(1)
        return expect(SearchAttributesMiddleware.isPresent("endDateTime", body)).rejects.toEqual('Especifique o endDateTime')
    })
    test('Passing a body without interval', () => {
        body = {
            webid: "E0Yfc0jetNdUKgzx5SiPQwKAh-vBfrqz6RGqUA5W_jVX9gRUMyQU1BWi1UMU41RUo1XE9NT1xORVhBIFZBWkFOVEVcTUFMSEFTXFBJREVfNjg",
            startDateTime: "2019-12-14 15:00:47",
            endDateTime: "2019-12-15 16:00:47",
            attributes: ["Bit Status"],
            isSubattribute: "false",
        }
        expect.assertions(1)
        return expect(SearchAttributesMiddleware.isPresent("interval", body)).rejects.toEqual('Especifique o interval')
    })
    test('Passing a body without attributes', () => {
        body = {
            webid: "E0Yfc0jetNdUKgzx5SiPQwKAh-vBfrqz6RGqUA5W_jVX9gRUMyQU1BWi1UMU41RUo1XE9NT1xORVhBIFZBWkFOVEVcTUFMSEFTXFBJREVfNjg",
            startDateTime: "2019-12-14 15:00:47",
            endDateTime: "2019-12-15 16:00:47",
            interval: "00:00:01",
            isSubattribute: "false",
        }
        expect.assertions(1)
        return expect(SearchAttributesMiddleware.isPresent("attributes", body)).rejects.toEqual('Especifique quais elementos deseja buscar')
    })
    test('Passing a body without isSubattribute', () => {
        body = {
            webid: "E0Yfc0jetNdUKgzx5SiPQwKAh-vBfrqz6RGqUA5W_jVX9gRUMyQU1BWi1UMU41RUo1XE9NT1xORVhBIFZBWkFOVEVcTUFMSEFTXFBJREVfNjg",
            startDateTime: "2019-12-14 15:00:47",
            endDateTime: "2019-12-15 16:00:47",
            interval: "00:00:01",
            attributes: ["Bit Status"],
        }
        expect.assertions(1)
        return expect(SearchAttributesMiddleware.isPresent("isSubattribute", body)).rejects.toEqual('Especifique se a busca é por atributo ou subatributo')
    })
})

describe('Testing validateDatesAndInterval() function', () => {
    test('Passing the correct body needs to call next', () => {
        expect.assertions(1)
        const req  = httpMocks.createRequest({
            method: 'POST',
            url: '/searchAttributes/values',
            body: {
                "webid": "E0Yfc0jetNdUKgzx5SiPQwKAh-vBfrqz6RGqUA5W_jVX9gRUMyQU1BWi1UMU41RUo1XE9NT1xORVhBIFZBWkFOVEVcTUFMSEFTXFBJREVfNjg",
                "startDateTime": "2019-12-14 15:00:47",
                "endDateTime": "2019-12-15 16:00:47",
                "interval": "00:00:01",
                "attributes": ["Bit Status"],
                "isSubattribute": "false"
            }
        });
        const res = httpMocks.createResponse();

        const next = jest.fn();
        SearchAttributesMiddleware.validateDatesAndInterval(req, res, next)
        expect(next).toHaveBeenCalled()
    })
})

describe('Testing validateDateTimeFormat() function', () => {
    test('Passing a date with a correct pattern should not throw a exception', () => {
        expect.assertions(1)
        date = "2019-12-15 15:00:47"
        expect(function(){
            SearchAttributesMiddleware.validateDateTimeFormat(date, "date")
        }).not.toThrow();
    })

    test('Passing a date with a incorrect pattern should throw a Error exception', () => {
        expect.assertions(2)
        date = "yyyy 15:00:47"
        try{
            SearchAttributesMiddleware.validateDateTimeFormat(date, "date")
        }catch(err){
            expect(err).toBeInstanceOf(Error)
            expect(err).toHaveProperty('message', 'date está no formato errado, use YYYY-MM-DD HH:mm:ss')
        }
    })

    test('Passing a date with incorrect pattern and no attribute messge should throw a default Error exception', () => {
        expect.assertions(2)
        date = "2019-12-15 hh:00:47"
        try{
            SearchAttributesMiddleware.validateDateTimeFormat(date)
        }catch(err){
            expect(err).toBeInstanceOf(Error)
            expect(err).toHaveProperty('message', 'dateTime está no formato errado, use YYYY-MM-DD HH:mm:ss')
        }
    })
})

describe('Testing validateHourFormat() function', () => {
    test('Passing a hour with correct pattern should not throw a Error exception', () => {
        expect.assertions(1)
        hour = "03:00:01"
        expect(function(){
            SearchAttributesMiddleware.validateHourFormat(hour, "hour")
        }).not.toThrow();
    })
    test('Passing a hour with a incorrect pattern should throw a Error exception', () => {
        expect.assertions(2)
        hour = "hh:00:47"
        try{
            SearchAttributesMiddleware.validateHourFormat(hour, "interval")
        }catch(err){
            expect(err).toBeInstanceOf(Error)
            expect(err).toHaveProperty('message', 'interval está no formato errado, use HH:mm:ss')
        }
    })
    test('Passing a hour with a incorrect pattern and no attribute message should throw a default Error exception', () => {
        expect.assertions(2)
        hour = "hh:00:47"
        try{
            SearchAttributesMiddleware.validateHourFormat(hour)
        }catch(err){
            expect(err).toBeInstanceOf(Error)
            expect(err).toHaveProperty('message', 'hour está no formato errado, use HH:mm:ss')
        }
    })
})

describe('Testing validatePeriods() function', () => {
    test('Passing correct startDateTime, endDateTime and interval should not throw a Error exception', () => {
        expect.assertions(1)
        startDateTime = "2019-12-15 15:00:47"
        endDateTime = "2019-12-15 16:00:47"
        interval = "00:00:01"
        expect(function(){
            SearchAttributesMiddleware.validatePeriods(startDateTime, endDateTime, interval)
        }).not.toThrow();
    })
    test('Passing a startDateTime bigger than endDateTime should throw a Error exception', () => {
        expect.assertions(2)
        startDateTime = "2019-12-16 15:00:47"
        endDateTime = "2019-12-15 16:00:47"
        interval = "00:00:01"
        try{
            SearchAttributesMiddleware.validatePeriods(startDateTime, endDateTime, interval)
        }catch(err){
            expect(err).toBeInstanceOf(Error)
            expect(err).toHaveProperty('message', 'startDateTime deve ser menor do que endDateTime')
        }
    })
    test('Passing a interval bigger than the difference between endDateTime and startDateTime should throw a Error exception', () => {
        expect.assertions(2)
        startDateTime = "2019-12-15 15:00:47"
        endDateTime = "2019-12-15 16:00:47"
        interval = "03:00:00"
        try{
            SearchAttributesMiddleware.validatePeriods(startDateTime, endDateTime, interval)
        }catch(err){
            expect(err).toBeInstanceOf(Error)
            expect(err).toHaveProperty('message', 'A duração do intervalo de amostragem é maior que o intervalo a ser buscado')
        }
    })
})