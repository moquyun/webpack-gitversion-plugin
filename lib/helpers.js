const fs = require('fs')
const exec = require('child_process').execSync

const gitHEAD = fs.readFileSync('.git/HEAD', 'utf-8').trim()

const generateGitVersion = () => {
  const git_version = {}

  git_version.git_branch = exec(`git name-rev --name-only HEAD`)
    .toString('utf8')
    .replace(/\n/g, '')

  if (gitHEAD.match(/^[0-9a-z]+$/)) {
    git_version.git_commit_id = gitHEAD
  } else {
    const branchRef = gitHEAD.split(': ')[1]
    git_version.git_commit_id = fs
      .readFileSync(`.git/${branchRef}`, 'utf-8')
      .trim()
  }
  // 当前时间
  const tmpDate = new Date()
  const y = tmpDate.getFullYear()
  const M = tmpDate.getMonth() + 1
  const d = tmpDate.getDate()
  const H = tmpDate.getHours()
  const m = tmpDate.getMinutes()
  const s = tmpDate.getSeconds()

  git_version.build_time = `${y}-${M}-${d} ${H}:${m}:${s}`
  return git_version
}

module.exports = { generateGitVersion }
