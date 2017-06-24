'use strict';

class NetworkError extends Error
{
    constructor(message, status)
	{
        super(message);
        this.status = status;
    }
}
NetworkError.INTERNAL_ERROR = 500;
NetworkError.NOT_FOUND = 404;
NetworkError.NOT_ALLOWED = 403;
NetworkError.NOT_AUTHORIZED = 401;
NetworkError.BAD_REQUEST = 400;
NetworkError.OK = 200;

global.NetworkError = NetworkError;
