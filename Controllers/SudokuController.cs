using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SudokuSolverApi.Models;
using SudokuSolverApi.Services;

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

    [HttpGet]
    public ActionResult<string> Get()
    {
        return "Welcome to the Sudoku Solver API. Use POST /sudoku/solve to solve a Sudoku puzzle.";
    }

    [HttpPost("solve")]
    public ActionResult<SudokuPuzzle> Solve(SudokuPuzzle puzzle)
    {
        _logger.LogInformation("Received Sudoku puzzle to solve");

        if (!puzzle.IsValid())
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
}
