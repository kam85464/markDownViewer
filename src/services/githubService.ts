export interface GithubFile {
  name: string;
  path: string;
  parent: string;
  type: 'file' | 'dir';
  download_url?: string;
}

export const githubService = {
  token: localStorage.getItem('github_token') || '',

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('github_token', token);
  },

  getHeaders() {
    return {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...(this.token ? { 'Authorization': `token ${this.token}` } : {})
    };
  },

  async createBranch(owner: string, repo: string, baseBranch: string, newBranch: string) {
    const refResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${baseBranch}`, { headers: this.getHeaders() });
    const refData = await refResponse.json();
    const sha = refData.object.sha;

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ ref: `refs/heads/${newBranch}`, sha })
    });
    if (!response.ok) throw new Error('Failed to create branch');
    return response.json();
  },

  async commitFile(owner: string, repo: string, branch: string, path: string, content: string, message: string) {
    // 1. Get current file SHA
    const fileResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, { headers: this.getHeaders() });
    const fileData = await fileResponse.json();
    const sha = fileData.sha;

    // 2. Update file
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({
        message,
        content: btoa(content),
        sha,
        branch
      })
    });
    if (!response.ok) throw new Error('Failed to commit file');
    return response.json();
  },

  async createPullRequest(owner: string, repo: string, head: string, base: string, title: string, body: string) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ title, body, head, base })
    });
    if (!response.ok) throw new Error('Failed to create PR');
    return response.json();
  },

  async getPullRequests(owner: string, repo: string) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=open`, { headers: this.getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch pull requests');
    return response.json();
  },

  async mergePullRequest(owner: string, repo: string, pullNumber: number, method: 'merge' | 'squash' | 'rebase' = 'squash') {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/merge`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ merge_method: method })
    });
    if (!response.ok) throw new Error('Failed to merge PR');
    return response.json();
  },

  async loadFromUrl(url: string): Promise<{ type: 'file' | 'dir', content?: string, files?: GithubFile[], file?: GithubFile }> {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname !== 'github.com') throw new Error('Not a GitHub URL');
      
      const parts = urlObj.pathname.split('/').filter(Boolean);
      const owner = parts[0];
      const repo = parts[1];
      
      if (!owner || !repo) throw new Error('Invalid GitHub URL');

      // Check if it is a blob (file)
      if (parts[2] === 'blob') {
        const branch = parts[3];
        const path = parts.slice(4).join('/');
        const downloadUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
        
        const response = await fetch(downloadUrl, { headers: this.getHeaders() });
        if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);
        const content = await response.text();
        
        return {
          type: 'file',
          content,
          file: {
            name: parts[parts.length - 1],
            path: url,
            parent: repo,
            type: 'file'
          }
        };
      } else {
        // Assume tree/folder or root
        let branch = 'main';
        let dirPath = '';
        
        if (parts[2] === 'tree') {
          branch = parts[3];
          dirPath = parts.slice(4).join('/');
        } else {
           // Try to get default branch
           try {
             const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: this.getHeaders() });
             if (repoResponse.ok) {
               const repoData = await repoResponse.json();
               branch = repoData.default_branch;
             }
           } catch (e) {
             console.warn('Failed to fetch repo info, defaulting to main', e);
          }
        }

        // Fetch tree recursively
        const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
        const response = await fetch(treeUrl, { headers: this.getHeaders() });
        if (!response.ok) throw new Error(`Failed to fetch tree: ${response.statusText}`);
        const data = await response.json();

        if (data.tree && Array.isArray(data.tree)) {
             const files: GithubFile[] = data.tree
            .filter((item: any) => item.type === 'blob' && item.path.endsWith('.md'))
            .filter((item: any) => !dirPath || item.path.startsWith(dirPath + '/'))
            .map((item: any) => {
                const itemPathParts = item.path.split('/');
                const name = itemPathParts.pop();
                const parent = itemPathParts.length > 0 ? itemPathParts.join('/') : repo;
                
                return {
                    name: name,
                    path: item.path,
                    parent: parent,
                    type: 'file',
                    download_url: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${item.path}`
                };
            });
            return { type: 'dir', files };
        }
      }
      throw new Error('Unknown response from GitHub');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};