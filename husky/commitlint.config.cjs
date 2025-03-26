/* commitlint.config.cjs */

module.exports = {
  extends: ['git-commit-emoji'],
  prompt: {
    skipQuestions: ['scope', 'body', 'breaking', 'footer'], // 跳过 scope、body、breaking、footer 三个问题
    allowEmptyIssuePrefixs: false, //  不允许空 issue 前缀
    allowCustomIssuePrefixs: false, //  不允许自定义 issue 前缀
    userEmoji: true, // 允许使用 emoji
    emojiAlign: 'left', // emoji 位于左边

    messages: {
      type: '选择你要提交的类型 :',
      subject: '填写简短精炼的变更描述 :\n',
      confirmCommit: '是否提交或修改commit ?'
    },

    types: [
      { value: 'init', name: '🎉 init: 初始化项目', emoji: '🎉' },
      { value: 'feat', name: '✨ feat: 新增功能', emoji: '✨' },
      { value: 'fix', name: '🐞 fix: 修复bug', emoji: '🐞' },
      { value: 'docs', name: '📃 docs: 文档变更', emoji: '📃' },
      { value: 'style', name: '🌈 style: 代码格式（仅仅修改了空格、缩进、逗号等等，不改变代码逻辑）', emoji: '🌈' },
      { value: 'refactor', name: '🦄 refactor: 代码重构，没有加新功能或修复bug', emoji: '🦄' },
      { value: 'perf', name: '🎈 perf: 代码优化，比如提升性能、体验', emoji: '🎈' },
      { value: 'test', name: '🧪 test: 添加疏漏测试或已有测试改动', emoji: '🧪' },
      { value: 'build', name: '🔧 build: 构建流程、外部依赖变更 (如升级 npm 包、修改打包配置等)', emoji: '🔧' },
      { value: 'ci', name: '🐎 ci: 修改 CI 配置，例如对k8s、docker的配置文件的修改', emoji: '🐎' },
      { value: 'chore', name: '🐳 chore: 对构建过程或辅助工具和库的更改 (不影响源文件、测试用例)', emoji: '🐳' },
      { value: 'revert', name: '↩ revert: 回滚 commit', emoji: '↩' }
    ]
  }
}

