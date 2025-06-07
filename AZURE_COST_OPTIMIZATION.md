# Azure Cost Optimization for NyaySetu

This guide provides recommendations for optimizing Azure costs while maintaining functionality for your NyaySetu application with a 45 Azure credit budget.

## Recommended Service Tiers

| Service              | Tier        | Monthly Cost (Credits) | Features                              |
| -------------------- | ----------- | ---------------------- | ------------------------------------- |
| App Service          | Basic B1    | 5-10                   | 1 core, 1.75 GB RAM, 10 GB storage    |
| Cognitive Services   | Standard S0 | 5-8\*                  | Pay-as-you-go model, all features     |
| Speech Services      | Free F0     | 0                      | 5 hours audio/month, 10K transactions |
| Application Insights | Basic       | 3-5\*                  | 5 GB ingested data, 31-day retention  |

\*Depends on usage volume

## Cost-Saving Strategies

### 1. Use Bhashini API as Primary Service

- Configure your application to use Bhashini API as the primary service for translation, speech-to-text, and text-to-speech
- Only fall back to Azure services when Bhashini is unavailable or returns errors
- This significantly reduces Azure API calls and associated costs

Example fallback pattern (already implemented):

```javascript
try {
	// Try Bhashini API first
	const result = await bhashiniService.translateText(text, source, target);
	return result;
} catch (error) {
	// Fall back to Azure only when necessary
	return azureService.translateText(text, target, source);
}
```

### 2. Implement Caching for Repeated Queries

- Cache common translation results, speech-to-text transcriptions, and legal responses
- Use a simple in-memory cache for development or Redis Cache for production
- Set reasonable TTL (Time-To-Live) for cached items

Example implementation:

```javascript
const cache = new Map();

function getCachedOrFetch(key, fetchFn) {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const result = await fetchFn();
  cache.set(key, result);
  return result;
}
```

### 3. Batch API Requests When Possible

- Combine multiple translation requests into a single API call
- Use the batch endpoints for Text Analytics and Translator services
- This reduces per-transaction costs and improves efficiency

### 4. Implement Rate Limiting

- Add rate limiting to prevent abuse and control costs
- Limit the number of API calls per user/session
- Add delays between consecutive speech recognition requests

Example implementation:

```javascript
const rateLimit = require("express-rate-limit");

// Limit to 100 requests per hour
const apiLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 100,
});

app.use("/api/", apiLimiter);
```

### 5. Use Client-Side Processing When Appropriate

- Perform simple text operations on the client side
- Use the browser's SpeechRecognition API for basic speech recognition
- Only send data to Azure when more advanced capabilities are needed

### 6. Monitor and Set Alerts

- Set up budget alerts at 50%, 75%, and 90% of your 45 credit limit
- Create usage alerts for individual services
- Regularly review the cost analysis reports

## Service-Specific Optimizations

### App Service

- Enable auto-stop during development (stops the service when not in use)
- Use deployment slots only when necessary
- Consider scaling down during low-traffic periods

### Cognitive Services

- Start with the S0 tier and monitor usage
- Limit the length of texts sent for analysis
- Use filters to process only relevant content

### Speech Services

- Start with the Free tier (F0)
- Limit audio quality to reduce file sizes
- Implement client-side audio compression

### Application Insights

- Configure sampling to reduce data volume
- Filter out unnecessary telemetry
- Use custom events sparingly

## Monthly Budget Allocation

| Expense Category    | Credits | Notes                          |
| ------------------- | ------- | ------------------------------ |
| Core Infrastructure | 10      | App Service, network, etc.     |
| Language Services   | 15      | Translation, text analysis     |
| Speech Services     | 5       | Speech-to-text, text-to-speech |
| Monitoring          | 5       | Application Insights, alerts   |
| Buffer              | 10      | For unexpected usage spikes    |

## Monitoring Your Costs

1. Go to the Azure Portal
2. Navigate to "Cost Management + Billing"
3. Select "Cost analysis"
4. Filter by your resource group
5. View costs by service, location, or time period

## Conclusion

By following these optimization strategies, you should be able to keep your Azure costs within the 45 credit budget while providing a reliable service. Always monitor your usage and be prepared to adjust your architecture if costs begin to approach your limit.
