namespace SudokuSolverApi.Models
{
    public class Types
    {
        public int[][] Grid { get; set; }

        public Types()
        {
            Grid = new int[9][];
            for (int i = 0; i < 9; i++)
            {
                Grid[i] = new int[9];
            }
        }

        public bool IsValid()
        {
            if (Grid == null || Grid.Length != 9)
                return false;

            for (int i = 0; i < 9; i++)
            {
                if (Grid[i] == null || Grid[i].Length != 9)
                    return false;

                for (int j = 0; j < 9; j++)
                {
                    if (Grid[i][j] < 0 || Grid[i][j] > 9)
                        return false;
                }
            }

            return true;
        }
    }
}
