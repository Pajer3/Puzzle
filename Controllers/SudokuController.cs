using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SudokuSolverApi.Models;
using SudokuSolverApi.Services;
using System.Text.Json;

namespace SudokuSolverApi.Controllers;

[ApiController]
[Route("[controller]")]
public class SudokuController : ControllerBase
{
    private readonly SudokuSolverService _solverService;
    private readonly ILogger<SudokuController> _logger;

    public SudokuController(SudokuSolverService solverService, ILogger<SudokuController> logger)
    {
        _solverService = solverService;
        _logger = logger;
    }

    [HttpPost("solve")]
    public ActionResult<SudokuPuzzle> Solve([FromBody] JsonElement puzzleJson)
    {
        _logger.LogInformation("Received Sudoku puzzle to solve");

        try
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var puzzle = JsonSerializer.Deserialize<SudokuPuzzle>(puzzleJson.GetRawText(), options);

            if (puzzle == null || !puzzle.IsValid())
            {
                _logger.LogWarning("Received invalid Sudoku puzzle");
                return BadRequest("Invalid Sudoku puzzle format.");
            }

            if (_solverService.SolveSudoku(puzzle))
            {
                _logger.LogInformation("Successfully solved Sudoku puzzle");
                return Ok(puzzle);
            }
            else
            {
                _logger.LogWarning("Received unsolvable Sudoku puzzle");
                return BadRequest("The puzzle is unsolvable.");
            }
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Error deserializing JSON");
            return BadRequest("Invalid JSON format");
        }
    }
}
