# Price Tracker Buddy API Documentation

## Overview

The Price Tracker Buddy API provides a comprehensive interface for tracking and managing domain price changes across multiple TLD providers. This document outlines the available endpoints, request/response formats, and usage examples.

## Base URL

```
https://api.price-tracker-buddy.com
```

## Authentication

All API requests require authentication using a Bearer token:

```http
Authorization: Bearer YOUR_API_TOKEN
```

## Rate Limiting

- 100 requests per minute per IP address
- 10 requests per second per IP address
- Exceeded limits return 429 status code with retry-after header

## Endpoints

### Get Price Changes

Retrieve a list of recent price changes across all tracked TLDs.

```http
GET /price-changes
```

Query Parameters:
- `limit` (optional): Number of results to return (default: 50, max: 100)
- `offset` (optional): Offset for pagination (default: 0)
- `sort` (optional): Sort field (options: date, percentageChange, default: date)
- `order` (optional): Sort order (asc/desc, default: desc)

Response:
```json
{
  "data": [
    {
      "id": "string",
      "tld": "string",
      "oldPrice": "number",
      "newPrice": "number",
      "priceChange": "number",
      "percentageChange": "number",
      "date": "string (ISO 8601)",
      "history": [
        {
          "date": "string (ISO 8601)",
          "price": "number",
          "source": "string"
        }
      ],
      "alerts": [
        {
          "type": "price_drop | price_increase | threshold",
          "threshold": "number?",
          "percentage": "number?",
          "enabled": "boolean",
          "notifyVia": ["email | push | in_app"]
        }
      ],
      "lastChecked": "string (ISO 8601)",
      "nextCheck": "string (ISO 8601)",
      "sources": ["string"],
      "metadata": {}
    }
  ],
  "meta": {
    "total": "number",
    "limit": "number",
    "offset": "number"
  }
}
```

### Search TLDs

Search for specific TLDs and their price history.

```http
GET /search
```

Query Parameters:
- `tld` (required): Search query (e.g., "com", ".net")
- `exact` (optional): Exact match only (default: false)

Response: Same as /price-changes endpoint

### Get Price History

Retrieve historical price data for a specific TLD.

```http
GET /history/{tld}
```

Path Parameters:
- `tld` (required): The TLD to get history for (e.g., "com")

Query Parameters:
- `from` (optional): Start date (ISO 8601)
- `to` (optional): End date (ISO 8601)
- `resolution` (optional): Data resolution (day/week/month, default: day)

Response:
```json
{
  "data": [
    {
      "date": "string (ISO 8601)",
      "price": "number",
      "source": "string"
    }
  ],
  "meta": {
    "tld": "string",
    "resolution": "string",
    "dataPoints": "number"
  }
}
```

### Set Alert

Configure price alerts for a TLD.

```http
POST /alerts
```

Request Body:
```json
{
  "tld": "string",
  "type": "price_drop | price_increase | threshold",
  "threshold": "number?",
  "percentage": "number?",
  "enabled": "boolean",
  "notifyVia": ["email | push | in_app"]
}
```

Response:
```json
{
  "success": "boolean",
  "alert": {
    // Alert configuration as provided
  }
}
```

### Compare Prices

Compare prices across multiple TLDs.

```http
GET /compare
```

Query Parameters:
- `tlds` (required): Comma-separated list of TLDs to compare
- `includeHistory` (optional): Include price history (default: false)

Response:
```json
{
  "data": {
    "tld1": {
      // Price change object
    },
    "tld2": {
      // Price change object
    }
  },
  "meta": {
    "comparedAt": "string (ISO 8601)",
    "tldCount": "number"
  }
}
```

## Error Handling

All endpoints may return the following error responses:

- 400 Bad Request: Invalid parameters
- 401 Unauthorized: Missing or invalid authentication
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Server error

Error Response Format:
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

## Webhooks

You can configure webhooks to receive real-time notifications for:
- Price changes
- Alert triggers
- Data source updates

Webhook Configuration:
```http
POST /webhooks
```

Request Body:
```json
{
  "url": "string",
  "events": ["price.changed", "alert.triggered", "source.updated"],
  "secret": "string"
}
```

Webhook payloads are signed using HMAC-SHA256 with your webhook secret. Verify the signature in the X-Signature header to ensure authenticity.

## Best Practices

1. Implement exponential backoff for rate limit handling
2. Cache responses when appropriate
3. Use compression (gzip) for large responses
4. Monitor webhook delivery status
5. Validate webhook signatures
6. Use appropriate alert thresholds to avoid notification fatigue

## SDK Support

Official SDKs are available for:
- JavaScript/TypeScript (Node.js)
- Python
- Go
- Ruby

## Support

For API support:
- Email: api-support@price-tracker-buddy.com
- Documentation: https://docs.price-tracker-buddy.com
- Status Page: https://status.price-tracker-buddy.com