import redis from 'redis';
const client = redis.createClient(process.env.REDISCLOUD_URL || '127.0.0.1:6379', {
	no_ready_check: true
});

export default client;
