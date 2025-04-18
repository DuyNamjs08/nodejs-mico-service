        [Developer]
             |
             | 1. Push code
             v
          [GitHub]
             |
             | 2. Jenkins pull code từ GitHub
             v
          [Jenkins]
             |
             | 3. Jenkins chạy: Test, Lint, Build
             |
             | 4. Nếu OK → Jenkins push lên nhánh `master`
             v
          [GitHub (master branch)]
             |
             | 5. Render phát hiện thay đổi code
             v
          [Render]
             |
             | 6. Render tự động build & deploy app
             v
           [Production]
