/**
 * A hierarchical token bucket for rate limiting. See
 * http://en.wikipedia.org/wiki/Token_bucket for more information.
 *
 * @param options
 * @param options.bucketSize Maximum number of tokens to hold in the bucket.
 *  Also known as the burst rate.
 * @param options.tokensPerInterval Number of tokens to drip into the bucket
 *  over the course of one interval.
 * @param options.interval The interval length in milliseconds, or as
 *  one of the following strings: 'second', 'minute', 'hour', day'.
 * @param options.parentBucket Optional. A token bucket that will act as
 *  the parent of this bucket.
 */
_SMS.tokenBucket = function(options){
	const bucket = this;
	
	this.bucketSize = options.bucketSize;
	this.tokensPerInterval = options.tokensPerInterval;
	if(typeof options.interval === "string"){
		switch(options.interval){
			case "sec":
			case "second":
				this.interval = 1000;
				break;
			case "min":
			case "minute":
				this.interval = 1000 * 60;
				break;
			case "hr":
			case "hour":
				this.interval = 1000 * 60 * 60;
				break;
			case "day":
				this.interval = 1000 * 60 * 60 * 24;
				break;
			default:
				fail('Invalid interval ' + options.interval);
		};
	}else{
		this.interval = options.interval;
	};
	this.parentBucket = options.parentBucket;
	this.content = 0;
	this.lastDrip = Date.now();
    
	/**
	 * Asynchronous function
	 * 
     * Remove the requested number of tokens. If the bucket (and any parent
     * buckets) contains enough tokens this will happen immediately. Otherwise,
     * the removal will happen when enough tokens become available.
     * @param {Number} count The number of tokens to remove.
     * @returns {Number} The remainingTokens count.
     */
	this.removeTokens = function(){
		var count = _avoid_nilb(_function_argument("count"), 1);
		
		// Is this an infinite size bucket?
        if(bucket.bucketSize === 0){
            _function_return(Number.POSITIVE_INFINITY);
        };
        // Make sure the bucket can hold the requested number of tokens
        if(count > bucket.bucketSize){
			fail('Requested tokens ' + count + ' exceeds bucket size ' + bucket.bucketSize);
        };
        // Drip new tokens into this bucket
        bucket.drip();
        // If we don't have enough tokens in this bucket, come back later
		_if(count > bucket.content, function(){
			_call_function(bucket.comeBackLater,{count:count})!
			
			_function_return(_result_function());
		})!
		
		_if_else(bucket.parentBucket != undefined, function(){
			// Remove the requested from the parent bucket first
			_call_function(bucket.parentBucket.removeTokens,{count:count})!
			var remainingTokens = _result_function();
            // Check that we still have enough tokens in this bucket
            _if(count > bucket.content, function(){
				_call_function(bucket.comeBackLater,{count:count})!
				
				_function_return(_result_function());
			})!
            // Tokens were removed from the parent bucket, now remove them from
            // this bucket. Note that we look at the current bucket and parent
            // bucket's remaining tokens and return the smaller of the two values
            bucket.content -= count;
            _function_return(Math.min(remainingTokens, bucket.content));
		}, function(){
			// Remove the requested tokens from this bucket
            bucket.content -= count;
            _function_return(bucket.content);
		})!
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
	 * Asynchronous function
	 * 
     * Deferred call to removeTokens() function
     * @param {Number} count The number of tokens to remove.
     * @returns {Number} The remainingTokens count.
     */
	this.comeBackLater = function(){
		var count = _function_argument("count");
		
		// How long do we need to wait to make up the difference in tokens?
		var waitMs = Math.ceil((count - bucket.content) * (bucket.interval / bucket.tokensPerInterval));
		_call_function(bucket.wait,{ms:waitMs})!
		
		_call_function(bucket.removeTokens,{count:count})!
		var remainingTokens = _result_function();
		
		_function_return(remainingTokens);
	};
    
	/**
     * Attempt to remove the requested number of tokens and return immediately.
     * If the bucket (and any parent buckets) contains enough tokens this will
     * return true, otherwise false is returned.
     * @param {Number} count The number of tokens to remove.
     * @returns {Boolean} True if the tokens were successfully removed, otherwise
     *  false.
     */
    this.tryRemoveTokens = function(count){
		count = _avoid_nilb(_function_argument("count"), 1);
		
        // Is this an infinite size bucket?
        if (!bucket.bucketSize)
            return true;
        // Make sure the bucket can hold the requested number of tokens
        if (count > bucket.bucketSize)
            return false;
        // Drip new tokens into this bucket
        bucket.drip();
        // If we don't have enough tokens in this bucket, return false
        if (count > bucket.content)
            return false;
        // Try to remove the requested tokens from the parent bucket
        if (bucket.parentBucket && !bucket.parentBucket.tryRemoveTokens(count))
            return false;
        // Remove the requested tokens from this bucket and return
        bucket.content -= count;
        return true;
    };
    
	/**
     * Add any new tokens to the bucket since the last drip.
     * @returns {Boolean} True if new tokens were added, otherwise false.
     */
    this.drip = function(){
        if(bucket.tokensPerInterval === 0){
            var prevContent = bucket.content;
            bucket.content = bucket.bucketSize;
            return bucket.content > prevContent;
        };
        var now = Date.now();
        var deltaMS = Math.max(now - bucket.lastDrip, 0);
        bucket.lastDrip = now;
        var dripAmount = deltaMS * (bucket.tokensPerInterval / bucket.interval);
        var prevContent = bucket.content;
        bucket.content = Math.min(bucket.content + dripAmount, bucket.bucketSize);
        return Math.floor(bucket.content) > Math.floor(prevContent);
    };
};