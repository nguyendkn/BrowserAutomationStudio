/**
 * A generic rate limiter. Underneath the hood, this uses a token bucket plus
 * an additional check to limit how many tokens we can remove each interval.
 *
 * @param options
 * @param options.tokensPerInterval Maximum number of tokens that can be
 *  removed at any given moment and over the course of one interval.
 * @param options.interval The interval length in milliseconds, or as
 *  one of the following strings: 'second', 'minute', 'hour', day'.
 * @param options.fireImmediately Whether or not the promise will resolve
 *  immediately when rate limiting is in effect (default is false).
 * @param options.parentBucket Optional. A token bucket that will act as
 *  the parent of this bucket.
 */
_SMS.rateLimiter = function(options){
	const rate = this;
	
	this.tokenBucket = new _SMS.tokenBucket({
		bucketSize: options.tokensPerInterval,
		tokensPerInterval: options.tokensPerInterval,
		interval: options.interval,
		parentBucket: options.parentBucket
	});
	// Fill the token bucket to start
	this.tokenBucket.content = options.tokensPerInterval;
	this.curIntervalStart = Date.now();
	this.tokensThisInterval = 0;
	this.fireImmediately = _avoid_nilb(options.fireImmediately, false);
	
	/**
	 * Asynchronous function
	 * 
     * Remove the requested number of tokens. If the rate limiter contains enough
     * tokens and we haven't spent too many tokens in this interval already, this
     * will happen immediately. Otherwise, the removal will happen when enough
     * tokens become available.
     * @param {Number} count The number of tokens to remove.
     * @returns {Number} The remainingTokens count.
     */
    this.removeTokens = function(count){
		var count = _avoid_nilb(_function_argument("count"), 1);
		
        // Make sure the request isn't for more than we can handle
        if(count > rate.tokenBucket.bucketSize){
			fail('Requested tokens ' + count + ' exceeds maximum tokens per interval ' + rate.tokenBucket.bucketSize);
        };
        var now = Date.now();
        // Advance the current interval and reset the current interval token count
        // if needed
        if(now < rate.curIntervalStart || now - rate.curIntervalStart >= rate.tokenBucket.interval){
            rate.curIntervalStart = now;
            rate.tokensThisInterval = 0;
        };
        // If we don't have enough tokens left in this interval, wait until the
        // next interval
		_if(count > rate.tokenBucket.tokensPerInterval - rate.tokensThisInterval, function(){
			_if_else(rate.fireImmediately, function(){
				_function_return(-1);
			}, function(){
				var waitMs = Math.ceil(rate.curIntervalStart + rate.tokenBucket.interval - now);
				_call_function(rate.wait,{ms:waitMs})!
				_call_function(rate.tokenBucket.removeTokens,{count:count})!
				var remainingTokens = _result_function();
                rate.tokensThisInterval += count;
				_function_return(remainingTokens);
			})!
		})!
        // Remove the requested number of tokens from the token bucket
		_call_function(rate.tokenBucket.removeTokens,{count:count})!
		var remainingTokens = _result_function();
        rate.tokensThisInterval += count;
		_function_return(remainingTokens);
    };
	
	/**
	 * Asynchronous function
	 * 
     * Wait for a specified number of milliseconds
     * @param {Number} Number of milliseconds to wait.
     */
	this.wait = function(){
		var ms = _function_argument("ms");
		
		sleep(ms)!
	};
	
    /**
     * Attempt to remove the requested number of tokens and return immediately.
     * If the bucket (and any parent buckets) contains enough tokens and we
     * haven't spent too many tokens in this interval already, this will return
     * true. Otherwise, false is returned.
     * @param {Number} count The number of tokens to remove.
     * @returns {Boolean} True if the tokens were successfully removed, otherwise
     *  false.
     */
    this.tryRemoveTokens = function(count){
		count = _avoid_nilb(_function_argument("count"), 1);
		
        // Make sure the request isn't for more than we can handle
        if(count > rate.tokenBucket.bucketSize){
			return false;
		};
        var now = Date.now();
        // Advance the current interval and reset the current interval token count
        // if needed
        if(now < rate.curIntervalStart || now - rate.curIntervalStart >= rate.tokenBucket.interval){
            rate.curIntervalStart = now;
            rate.tokensThisInterval = 0;
        };
        // If we don't have enough tokens left in this interval, return false
        if(count > rate.tokenBucket.tokensPerInterval - rate.tokensThisInterval){
			return false;
		};
        // Try to remove the requested number of tokens from the token bucket
        var removed = rate.tokenBucket.tryRemoveTokens(count);
        if(removed){
            rate.tokensThisInterval += count;
        };
        return removed;
    };
	
    /**
     * Returns the number of tokens remaining in the TokenBucket.
     * @returns {Number} The number of tokens remaining.
     */
    this.getTokensRemaining = function(){
        rate.tokenBucket.drip();
        return rate.tokenBucket.content;
    };
};