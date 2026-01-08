#!/usr/bin/env node

/**
 * Release 验证脚本
 * 检查所有必需的文件是否存在并验证完整性
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 开始验证 V2.0.0 Release 准备情况...\n');

const errors = [];
const warnings = [];

// 检查文件是否存在
function checkFile(filePath, description) {
  const fullPath = path.resolve(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    const size = (stats.size / 1024).toFixed(2);
    console.log(`✅ ${description}: ${filePath} (${size} KB)`);
    return true;
  } else {
    console.log(`❌ 缺失: ${description} - ${filePath}`);
    errors.push(`缺失文件: ${filePath}`);
    return false;
  }
}

// 检查目录中的文件数量
function countFiles(dirPath, pattern, expectedCount, description) {
  const fullPath = path.resolve(__dirname, dirPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ 目录不存在: ${dirPath}`);
    errors.push(`目录不存在: ${dirPath}`);
    return false;
  }

  const files = fs.readdirSync(fullPath);
  const matched = files.filter(f => f.match(pattern));
  const count = matched.length;

  if (count === expectedCount) {
    console.log(`✅ ${description}: ${count}/${expectedCount} 个文件`);
    return true;
  } else {
    console.log(`⚠️  ${description}: ${count}/${expectedCount} 个文件 (预期 ${expectedCount})`);
    warnings.push(`${description}: ${count}/${expectedCount}`);
    return count > expectedCount * 0.9; // 90% 以上算通过
  }
}

console.log('📦 核心文件检查:');
checkFile('src/reachy-mini-3d-card-v2.js', 'V2 源代码');
checkFile('rollup.config.v2.js', 'V2 构建配置');
checkFile('package.json', '项目配置');

console.log('\n🏗️  构建产物检查:');
checkFile('dist/reachy-mini-3d-card.js', '主 JS 文件');
checkFile('dist/reachy-mini-3d-card.js.map', 'Source Map');

console.log('\n🤖 资源文件检查:');
checkFile('dist/assets/reachy-mini.urdf', 'URDF 定义');
countFiles('dist/assets/meshes', /\.stl$/i, 45, 'STL 网格文件');
countFiles('dist/assets/meshes', /.*/, 45, 'Mesh 目录总文件');

console.log('\n📚 库文件检查:');
checkFile('dist/lib/urdf-loader.js', 'URDFLoader 库');

console.log('\n📄 文档检查:');
checkFile('README-V2.md', 'V2 使用指南');
checkFile('MIGRATION_GUIDE.md', '迁移指南');
checkFile('TECHNICAL_COMPARISON.md', '技术对比');
checkFile('RELEASE_CHECKLIST.md', '发布清单');
checkFile('QUICK_START.md', '快速开始');

console.log('\n⚙️  GitHub Actions 检查:');
checkFile('.github/workflows/build-release.yml', '构建工作流');

console.log('\n📋 Git 标签检查:');
try {
  const { execSync } = require('child_process');
  const tagOutput = execSync('git show v2.0.0 --no-patch', { encoding: 'utf8' });
  if (tagOutput.includes('tag v2.0.0')) {
    console.log('✅ 本地标签 v2.0.0 存在');
  }
} catch (e) {
  console.log('❌ 本地标签 v2.0.0 不存在');
  errors.push('本地标签不存在');
}

try {
  const { execSync } = require('child_process');
  const remoteOutput = execSync('git ls-remote --tags origin v2.0.0', { encoding: 'utf8' });
  if (remoteOutput.includes('refs/tags/v2.0.0')) {
    console.log('✅ 远程标签 v2.0.0 已推送');
  }
} catch (e) {
  console.log('⚠️  无法检查远程标签');
  warnings.push('无法检查远程标签');
}

// 最终汇总
console.log('\n' + '='.repeat(60));
console.log('📊 验证结果汇总:');
console.log('='.repeat(60));

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n🎉 所有检查通过! Release 准备完成!\n');
  console.log('📍 下一步:');
  console.log('   1. 访问: https://github.com/Desmond-Dong/ha-reachy-mini-card/actions');
  console.log('   2. 查看 GitHub Actions 构建状态');
  console.log('   3. 访问: https://github.com/Desmond-Dong/ha-reachy-mini-card/releases/tag/v2.0.0');
  console.log('   4. 验证 Release 是否创建成功\n');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log(`\n❌ 发现 ${errors.length} 个错误:`);
    errors.forEach(err => console.log(`   - ${err}`));
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️  发现 ${warnings.length} 个警告:`);
    warnings.forEach(warn => console.log(`   - ${warn}`));
  }
  console.log('\n请修复这些问题后重试。\n');
  process.exit(1);
}
