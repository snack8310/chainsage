import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/PracticeDetail.module.css';

interface PracticeDetailProps {
  username: string;
  onLogout: () => void;
}

const practiceContents = {
  retail: {
    title: '零售行业实践',
    description: '探索零售行业的数字化转型和客户体验优化',
    difficulty: '中级',
    duration: '4小时',
    tags: ['机器学习', '数据分析', '预测模型'],
    content: `
# 零售行业实践

## 背景介绍
在零售行业中，数字化转型和客户体验优化是当前最重要的课题之一。通过数据分析和智能技术，我们可以更好地理解客户需求，优化业务流程，提升运营效率。

## 学习目标
- 理解零售行业数字化转型的关键要素
- 掌握客户体验优化的方法和工具
- 学习数据分析和可视化技术
- 实践智能推荐系统的开发

## 实践任务
1. 客户行为分析
   - 收集和分析客户购买数据
   - 构建客户画像
   - 识别购买模式和趋势

2. 智能推荐系统
   - 开发个性化推荐算法
   - 实现实时推荐功能
   - 评估推荐效果

3. 运营优化
   - 库存预测和管理
   - 促销活动优化
   - 供应链效率提升

## 技术要求
- Python 3.8+
- scikit-learn
- pandas
- numpy
- matplotlib
- Flask/Django

## 评估标准
- 系统功能完整性
- 算法准确性和效率
- 代码质量和可维护性
- 文档完整性

## 提交要求
- 完整的源代码
- 详细的文档说明
- 测试报告
- 演示视频（可选）
    `
  },
  finance: {
    title: '金融行业实践',
    description: '了解金融科技和智能金融服务的最新发展',
    difficulty: '高级',
    duration: '6小时',
    tags: ['金融科技', '智能风控', '量化交易'],
    content: `
# 金融行业实践

## 背景介绍
金融科技正在重塑传统金融服务模式，通过人工智能、大数据等技术，我们可以提供更智能、更高效的金融服务。

## 学习目标
- 理解金融科技的核心技术
- 掌握智能风控系统的开发
- 学习量化交易策略的实现
- 实践金融数据分析方法

## 实践任务
1. 智能风控系统
   - 风险评估模型开发
   - 欺诈检测系统实现
   - 实时监控告警

2. 量化交易策略
   - 策略回测系统
   - 实时交易执行
   - 风险控制模块

3. 金融数据分析
   - 市场趋势分析
   - 投资组合优化
   - 风险评估报告

## 技术要求
- Python 3.8+
- pandas
- numpy
- scikit-learn
- TensorFlow/PyTorch
- Backtrader

## 评估标准
- 系统安全性
- 策略有效性
- 代码质量
- 文档完整性

## 提交要求
- 完整的源代码
- 详细的文档说明
- 测试报告
- 演示视频（可选）
    `
  }
  // 其他行业的内容可以类似添加
};

const PracticeDetail: React.FC<PracticeDetailProps> = ({ username, onLogout }) => {
  const router = useRouter();
  const { industry } = router.query;

  // 根据 industry 获取对应的实践内容
  const practiceContent = industry && typeof industry === 'string' ? practiceContents[industry as keyof typeof practiceContents] : null;

  if (!practiceContent) {
    return <div>加载中...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{practiceContent.title}</h1>
          <div className={styles.metaInfo}>
            <span className={`${styles.difficulty} ${styles[practiceContent.difficulty]}`}>
              {practiceContent.difficulty}
            </span>
            <span className={styles.duration}>⏱️ {practiceContent.duration}</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.tags}>
            {practiceContent.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>{tag}</span>
            ))}
          </div>
          <div className={styles.actions}>
            <button className={styles.startButton}>开始实践</button>
            <button className={styles.saveButton}>保存进度</button>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.markdown}>
            {practiceContent.content.split('\n').map((line, index) => {
              if (line.startsWith('# ')) {
                return <h1 key={index}>{line.substring(2)}</h1>;
              } else if (line.startsWith('## ')) {
                return <h2 key={index}>{line.substring(3)}</h2>;
              } else if (line.startsWith('- ')) {
                return <li key={index}>{line.substring(2)}</li>;
              } else if (line.startsWith('1. ')) {
                return <li key={index}>{line.substring(3)}</li>;
              } else if (line.trim() === '') {
                return <br key={index} />;
              } else {
                return <p key={index}>{line}</p>;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeDetail; 