import React from 'react';
import styles from '../styles/IndustryPractice.module.css';

interface PracticeScenario {
  id: string;
  title: string;
  description: string;
  difficulty: '初级' | '中级' | '高级';
  duration: string;
  tags: string[];
}

interface IndustryPracticeProps {
  industry: string;
  username: string;
  onLogout: () => void;
}

const practiceScenarios: Record<string, PracticeScenario[]> = {
  '零售': [
    {
      id: 'retail-1',
      title: '智能库存管理系统',
      description: '开发一个基于机器学习的库存预测系统，优化库存管理',
      difficulty: '中级',
      duration: '2小时',
      tags: ['机器学习', '数据分析', '预测模型']
    },
    {
      id: 'retail-2',
      title: '客户行为分析',
      description: '分析客户购买行为，构建个性化推荐系统',
      difficulty: '高级',
      duration: '3小时',
      tags: ['用户行为', '推荐系统', '大数据']
    }
  ],
  '金融': [
    {
      id: 'finance-1',
      title: '风险评估模型',
      description: '构建信用风险评估模型，预测贷款违约概率',
      difficulty: '高级',
      duration: '4小时',
      tags: ['风险评估', '机器学习', '金融分析']
    },
    {
      id: 'finance-2',
      title: '智能投资顾问',
      description: '开发自动化投资组合优化系统',
      difficulty: '中级',
      duration: '3小时',
      tags: ['投资组合', '优化算法', '金融科技']
    }
  ],
  '医疗': [
    {
      id: 'health-1',
      title: '疾病预测系统',
      description: '基于患者数据预测疾病风险',
      difficulty: '高级',
      duration: '4小时',
      tags: ['医疗AI', '预测模型', '数据分析']
    },
    {
      id: 'health-2',
      title: '医疗影像分析',
      description: '开发医学影像识别系统',
      difficulty: '中级',
      duration: '3小时',
      tags: ['计算机视觉', '深度学习', '医疗诊断']
    }
  ],
  '教育': [
    {
      id: 'edu-1',
      title: '智能学习系统',
      description: '构建个性化学习路径推荐系统',
      difficulty: '中级',
      duration: '3小时',
      tags: ['教育科技', '推荐系统', '学习分析']
    },
    {
      id: 'edu-2',
      title: '学生表现预测',
      description: '预测学生学习表现和干预建议',
      difficulty: '高级',
      duration: '4小时',
      tags: ['预测分析', '教育数据', '机器学习']
    }
  ],
  '制造': [
    {
      id: 'manufacture-1',
      title: '预测性维护系统',
      description: '开发设备故障预测系统',
      difficulty: '高级',
      duration: '4小时',
      tags: ['工业4.0', '预测维护', '物联网']
    },
    {
      id: 'manufacture-2',
      title: '生产优化系统',
      description: '优化生产线效率和质量控制',
      difficulty: '中级',
      duration: '3小时',
      tags: ['生产优化', '质量控制', '数据分析']
    }
  ],
  '物流': [
    {
      id: 'logistics-1',
      title: '智能路径规划',
      description: '开发最优配送路径规划系统',
      difficulty: '中级',
      duration: '3小时',
      tags: ['路径优化', '算法', '物流规划']
    },
    {
      id: 'logistics-2',
      title: '仓储管理系统',
      description: '构建智能仓储管理系统',
      difficulty: '高级',
      duration: '4小时',
      tags: ['仓储管理', '自动化', '系统集成']
    }
  ]
};

const IndustryPractice: React.FC<IndustryPracticeProps> = ({ industry, username, onLogout }) => {
  const scenarios = practiceScenarios[industry] || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{industry}行业实践</h1>
          <p className={styles.subtitle}>选择以下场景开始实践</p>
        </div>
        <div className={styles.userInfo}>
          <span>欢迎, {username}</span>
          <button onClick={onLogout} className={styles.logoutButton}>
            退出
          </button>
        </div>
      </div>
      
      <div className={styles.scenariosGrid}>
        {scenarios.map((scenario) => (
          <div key={scenario.id} className={styles.scenarioCard}>
            <div className={styles.scenarioHeader}>
              <h2 className={styles.scenarioTitle}>{scenario.title}</h2>
              <span className={`${styles.difficulty} ${styles[scenario.difficulty]}`}>
                {scenario.difficulty}
              </span>
            </div>
            <p className={styles.description}>{scenario.description}</p>
            <div className={styles.metaInfo}>
              <span className={styles.duration}>⏱️ {scenario.duration}</span>
              <div className={styles.tags}>
                {scenario.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
            <button className={styles.startButton}>开始实践</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndustryPractice; 