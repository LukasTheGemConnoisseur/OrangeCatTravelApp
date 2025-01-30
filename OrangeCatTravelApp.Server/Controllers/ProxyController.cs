using Microsoft.AspNetCore.Mvc;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

[ApiController]
[Route("api/proxy")]
public class ProxyController : ControllerBase
{
    private readonly HttpClient _httpClient;

    public ProxyController(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string searchQuery)
    {
        if (string.IsNullOrEmpty(searchQuery))
        {
            return BadRequest(new { message = "Search query is required." });
        }

        var encodedSearchQuery = Uri.EscapeDataString(searchQuery);

        var apiUrl = $"https://api.content.tripadvisor.com/api/v1/location/search?key=3ED8A95286CA4B0A90F2E60E06308D6B&searchQuery={encodedSearchQuery}&language=en";
        var request = new HttpRequestMessage(HttpMethod.Get, apiUrl);
        request.Headers.Add("accept", "application/json");
        request.Headers.Add("referer", "http://localhost:4200");  // Add localhost since you're developing locally
        request.Headers.Add("origin", "http://localhost:4200");

        var response = await _httpClient.SendAsync(request);

        if (response.IsSuccessStatusCode)
        {
            var data = await response.Content.ReadAsStringAsync();
            return Content(data, "application/json");
        }

        return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
    }

    [HttpGet("suggested")]
    public async Task<IActionResult> Suggested([FromQuery] Int32 locationId)
    {
        var apiUrl = $"https://api.content.tripadvisor.com/api/v1/location/{locationId}/details?key=3ED8A95286CA4B0A90F2E60E06308D6B&language=en&currency=USD";
        var request = new HttpRequestMessage(HttpMethod.Get, apiUrl);
        request.Headers.Add("accept", "application/json");
        request.Headers.Add("referer", "http://localhost:4200");  // Add localhost since you're developing locally
        request.Headers.Add("origin", "http://localhost:4200");

        var response = await _httpClient.SendAsync(request);

        if (response.IsSuccessStatusCode)
        {
            var data = await response.Content.ReadAsStringAsync();
            return Content(data, "application/json");
        }

        return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
    }

    [HttpGet("suggestedPhoto")]
    public async Task<IActionResult> SuggestedPhoto([FromQuery] Int32 locationId)
    {
        var apiUrl = $"https://api.content.tripadvisor.com/api/v1/location/{locationId}/photos?key=3ED8A95286CA4B0A90F2E60E06308D6B&language=en&limit=1";
        var request = new HttpRequestMessage(HttpMethod.Get, apiUrl);
        request.Headers.Add("accept", "application/json");
        request.Headers.Add("referer", "http://localhost:4200");  // Add localhost since you're developing locally
        request.Headers.Add("origin", "http://localhost:4200");

        var response = await _httpClient.SendAsync(request);
        if (response.IsSuccessStatusCode)
        {
            
            var data = await response.Content.ReadAsStringAsync();
            return Content(data, "application/json");
        }

        return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
    }

}
