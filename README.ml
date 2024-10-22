# Sudoku Solver Web API

This project is a microservice web API built in C# .NET that solves Sudoku puzzles. It's designed to be scalable, maintainable, and easily deployable.

## Prerequisites

- .NET 8 SDK
- Docker (for containerized deployment)

## Building and Running Locally

1. Clone the repository:   ```bash
   git clone <repository-url>
   cd SudokuSolverApi   ```

2. Build the project:   ```bash
   dotnet build   ```

3. Run the project:   ```bash
   dotnet run   ```

The API will be available at `http://localhost:5000`.

## Running Tests

To run the integration tests, use the following command:


## Building and Running with Docker

1. Build the Docker image:
   ```bash
   docker build -t sudokusolverapi .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 8080:80 sudokusolverapi
   ```

The API will be available at `http://localhost:8080`.

## Using the API

The API exposes a single endpoint:

- `POST /sudoku/solve`

To solve a Sudoku puzzle, send a POST request to this endpoint with a JSON body representing the puzzle. The puzzle should be a 9x9 grid represented as a 2D array, where 0 represents empty cells.

### Example Request Body:

```json
{
  "grid": [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
  ]
}
```

### Expected Response:

The API will return a JSON object with the solved Sudoku grid or an error message if the puzzle is unsolvable.

This is a complete Sudoku Solver Web API project with the following features:

1. A C# .NET Web API that solves Sudoku puzzles
2. Input validation and error handling
3. Logging
4. Integration tests
5. Dockerization for easy deployment
6. A README file with instructions on how to build, run, and use the service

You can now push this cloned project to a Git repository of your choice (e.g., GitHub) for sharing and collaboration.

## Commands

```bash
dotnet run SudokuSolverApi
dotnet build SudokuSolverApi
dotnet test SudokuSolverApi
dotnet publish SudokuSolverApi
npm run dev
```
