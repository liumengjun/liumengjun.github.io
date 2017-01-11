# Some Tricks of Using GitHub    

### 预览html
- https://htmlpreview.github.io/

### raw文件
- raw.githubusercontent.com   

  > e.g.   
    https://raw.githubusercontent.com/liumengjun/towersOfHanoi/master/towersOfHanoi.apk

- ?raw=true   

  > e.g.   
    https://github.com/liumengjun/SudokuPuzzle/blob/master/SudokuPuzzle.apk?raw=true

### 打包下载
归档链接 `github.com/repos/:owner/:repo/:archive_format/:ref` [@see GitHub API](https://developer.github.com/v3/repos/contents/#get-archive-link)

| 字段 | 说明 |
|----------------|-------------------|
|`owner`         | GitHub用户名       |
|`repo`          | 项目名             |
|`archive_format`| tarball 或 zipball |
|`ref`           | 有效的Git引用，branch、tag、commit |
例如：    
https://github.com/liumengjun/liumengjun.github.io/tarball/master    
https://github.com/liumengjun/liumengjun.github.io/zipball/b16ffbcb8    

### 删除敏感数据
- use [bfg](https://rtyley.github.io/bfg-repo-cleaner/)
  or [git-filter-branch](https://git-scm.com/docs/git-filter-branch).
  [@see help doc](https://help.github.com/articles/remove-sensitive-data/)
- git-rebase -i 修改历史commit点然后提交（commit较多时不方便）

### GitHub Pages
- create a repo named ${your_username}.github.io. [more>>](https://pages.github.com/)

