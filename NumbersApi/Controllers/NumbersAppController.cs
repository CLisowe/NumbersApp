using Microsoft.AspNetCore.Mvc;

namespace NumbersApi.Controllers;

[ApiController]
[Route("api/inventory")]
public class NumbersController : ControllerBase
{
    [HttpGet]
    public IActionResult GetInventory()
    {
        return Ok(new[]
        {
            new {code = "A", name = "Wheat Bread", quantity = 20},
            new {code = "B", name = "White Bread", quantity = 12},
            new {code = "C", name = "Cookies", quantity = 7}
        });
    }
}