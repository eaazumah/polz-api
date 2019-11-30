import redis from 'redis';
const client = redis.createClient(process.env.REDISCLOUD_URL || 'redis://localhost:6379', {
	no_ready_check: true
});

export default client;
