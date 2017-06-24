'use strict';

const express = require('express');
const router = express.Router();
const debug = require('debug')('slots:api');

const symbols = ['J', 'Q', 'K', 'T'];
const MIN_BET = 1;
const MAX_BET = 5;


router.post('/', function(req, res, next)
{
    const body = req.body;

    debug(req.body);

    if(!body.action)
        return next(new NetworkError('No action', NetworkError.BAD_REQUEST));

    if(body.action !== 'SpinRequest')
        return next(new NetworkError('action error: no action with name ' + req.body.action, NetworkError.BAD_REQUEST));

    if(!body.data)
        return next(new NetworkError('No data', NetworkError.BAD_REQUEST));

    const data = body.data;

    if(!data.symbol)
        return next(new NetworkError('invalid data symbol type', NetworkError.BAD_REQUEST));

    if(typeof data.symbol !== 'string')
        return next(new NetworkError('invalid data symbol type', NetworkError.BAD_REQUEST));

    if(!symbols.includes(data.symbol))
        return next(new NetworkError('invalid data symbol val', NetworkError.BAD_REQUEST));

    if(!data.bet)
        return next(new NetworkError('No bet', NetworkError.BAD_REQUEST));

    data.bet = parseFloat(data.bet);

    if (data.bet < MIN_BET || data.bet > MAX_BET)
        return next(new NetworkError('invalid data bet value', NetworkError.BAD_REQUEST));

    const spinResult = [];

    for (let index = 0; index < 5; index++)
    {
        let sIndex = Math.floor(Math.random() * symbols.length);

        spinResult.push(symbols[sIndex]);
    }

    let totalWin = 0;
    let winType = 'none';
    let winFactor = 0;
    let targetSymbol = spinResult[2];

    if (targetSymbol === data.symbol)
    {
        winType = 'regular';
        winFactor = Math.floor(Math.random() * 10) + 1;

        if (winFactor >= 5)
        {
            winType = 'bigWin';
        }
        totalWin = winFactor * data.bet;
    }

    const spinResponse = {
        action: 'SpinResponse',
        data: {
            winType: winType,
            totalWin: totalWin,
            spinResult: spinResult
        }
    };

    res.json(spinResponse);
});

module.exports = router;
