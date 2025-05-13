import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/PracticePacks.module.css';

interface PracticePack {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: '初级' | '中级' | '高级';
  duration: string;
  lessons: number;
}

const practicePacks: PracticePack[] = [
  {
    id: 'retail',
    title: '零售行业实践',
    description: '探索零售行业的数字化转型和客户体验优化',
    icon: '🛍️',
    difficulty: '中级',
    duration: '4小时',
    lessons: 8
  },
  {
    id: 'finance',
    title: '金融行业实践',
    description: '了解金融科技和智能金融服务的最新发展',
    icon: '💰',
    difficulty: '高级',
    duration: '6小时',
    lessons: 10
  },
  {
    id: 'healthcare',
    title: '医疗行业实践',
    description: '探索医疗健康领域的创新技术和解决方案',
    icon: '🏥',
    difficulty: '高级',
    duration: '5小时',
    lessons: 9
  },
  {
    id: 'education',
    title: '教育行业实践',
    description: '发现教育科技和在线学习的未来趋势',
    icon: '📚',
    difficulty: '中级',
    duration: '4小时',
    lessons: 8
  },
  {
    id: 'manufacturing',
    title: '制造行业实践',
    description: '了解智能制造和工业4.0的实践案例',
    icon: '🏭',
    difficulty: '高级',
    duration: '6小时',
    lessons: 10
  },
  {
    id: 'logistics',
    title: '物流行业实践',
    description: '探索物流供应链的数字化和智能化解决方案',
    icon: '🚚',
    difficulty: '中级',
    duration: '5小时',
    lessons: 9
  }
];

const PracticePacks: React.FC = () => {
  const router = useRouter();

  const handleStartPractice = (packId: string) => {
    router.push(`/practices/${packId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>行业实践</h1>
        <p className={styles.subtitle}>选择以下行业开始实践</p>
      </div>
      
      <div className={styles.packsGrid}>
        {practicePacks.map((pack) => (
          <div 
            key={pack.id} 
            className={styles.packCard}
          >
            <div className={styles.packHeader}>
              <div className={styles.icon}>{pack.icon}</div>
              <div className={styles.difficulty}>{pack.difficulty}</div>
            </div>
            <h2 className={styles.packTitle}>{pack.title}</h2>
            <p className={styles.description}>{pack.description}</p>
            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>⏱️ 时长</span>
                <span className={styles.metaValue}>{pack.duration}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>📚 课程数</span>
                <span className={styles.metaValue}>{pack.lessons}</span>
              </div>
            </div>
            <button 
              className={styles.startButton}
              onClick={() => handleStartPractice(pack.id)}
            >
              开始学习
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticePacks; 