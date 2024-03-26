'use strict';
import Redis from "ioredis";
const redis = new Redis();

redis.connect((err, data) => {
    console.log("== Redis Connected ==");
});

export const checkKeyExists = async (keys = []) => {
    const data = await redis.exists(keys);
    return data;
};

export const setRedisKey = async (key, value, ttl) => {
    const data = await redis.setex(key, ttl, value);
    return data;
};

export const getRedisKey = async (key) => {
    const data = await redis.get(key);
    return data;
};

export const addItem = async (key, item) => {
    const data = await redis.sadd(key, item);
    return data;
};

export const removeItem = async (key, item) => {
    const data = await redis.srem(key, item);
    return data;
};

export const checkItem = async (key, member) => {
    const data = await redis.sismember(key, member);
    return data;
};

export const setHash = async (key, object) => {
    const data = await redis.hset(key, object);
    return data;
};

export const getHash = async (key) => {
    const data = await redis.hgetall(key);
    return data;
};

export const deleteKey = async (key) => {
    const data = await redis.del(key);
    return data;
};
