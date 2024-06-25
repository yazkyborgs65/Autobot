const axios = require('axios');
const path = require('path');

module.exports.config = {
    name: "gitadd",
    version: "1.0",
    author: "cliff",
    countDown: 5,
    cooldown: 5,
    credits: "cliff",
    role: 0,
    hasPrefix: true,
    description: "Add a new file to a private GitHub repository using a file name and code content or a URL to the code.",
    commandCategory: "utility",
    usages: {
        en: "Use the command as follows:\ngitadd <file name>.js <code url | code>"
    }
};

module.exports.run = async function ({ api, args, event }) {
    const pogi = "61557118090040";
    if (!pogi.includes(event.senderID))
        return api.sendMessage("This Command is only for AUTOBOT owner.", event.threadID, event.messageID);

    if (args.length < 2) {
        return api.sendMessage("Please provide the file name and code content or code URL.");
    }

    const fileName = args[0];
    if (!fileName.endsWith('.js')) {
        return api.sendMessage("The file name must end with '.js'.");
    }

    const codeSource = args.slice(1).join(" ");
    const githubToken = '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'; 
    const owner = 'Cliffshipazu'; 
    const repo = 'Ozhbckav'; 
    const branch = 'main';
    const filePath = path.join('script', fileName);

    try {
        let code;

        if (codeSource.startsWith('http://') || codeSource.startsWith('https://')) {
            const response = await axios.get(codeSource);
            code = response.data;
        } else {
            code = codeSource;
        }

        const { data: refData } = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, {
            headers: {
                Authorization: `token ${githubToken}`
            }
        });
        const latestCommitSha = refData.object.sha;

        const { data: commitData } = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/commits/${latestCommitSha}`, {
            headers: {
                Authorization: `token ${githubToken}`
            }
        });
        const baseTreeSha = commitData.tree.sha;

        const { data: blobData } = await axios.post(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
            content: code,
            encoding: 'utf-8'
        }, {
            headers: {
                Authorization: `token ${githubToken}`
            }
        });

        const { data: treeData } = await axios.post(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
            base_tree: baseTreeSha,
            tree: [
                {
                    path: filePath,
                    mode: '100644',
                    type: 'blob',
                    sha: blobData.sha
                }
            ]
        }, {
            headers: {
                Authorization: `token ${githubToken}`
            }
        });

        const { data: newCommitData } = await axios.post(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
            message: `Added ${fileName} `,
            tree: treeData.sha,
            parents: [latestCommitSha]
        }, {
            headers: {
                Authorization: `token ${githubToken}`
            }
        });

        await axios.patch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
            sha: newCommitData.sha
        }, {
            headers: {
                Authorization: `token ${githubToken}`
            }
        });

        api.sendMessage(` ${fileName} added`);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while adding the file. Please try again.");
    }
};
