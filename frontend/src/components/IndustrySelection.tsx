import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/IndustrySelection.module.css';

interface IndustryCard {
  title: string;
  description: string;
  icon: string;
}

interface IndustrySelectionProps {
  username: string;
  onLogout: () => void;
}

const industries: IndustryCard[] = [
  {
    title: '零售',
    description: '探索零售行业的数字化转型和客户体验优化',
    icon: '🛍️'
  },
  {
    title: '金融',
    description: '了解金融科技和智能金融服务的最新发展',
    icon: '💰'
  },
  {
    title: '医疗',
    description: '探索医疗健康领域的创新技术和解决方案',
    icon: '🏥'
  },
  {
    title: '教育',
    description: '发现教育科技和在线学习的未来趋势',
    icon: '📚'
  },
  {
    title: '制造',
    description: '了解智能制造和工业4.0的实践案例',
    icon: '🏭'
  },
  {
    title: '物流',
    description: '探索物流供应链的数字化和智能化解决方案',
    icon: '🚚'
  }
];

const IndustrySelection: React.FC<IndustrySelectionProps> = ({ username, onLogout }) => {
  const router = useRouter();

  const handleIndustryClick = (industry: string) => {
    router.push(`/practices/${encodeURIComponent(industry)}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>选择行业</h1>
        <div className={styles.userInfo}>
          <span>欢迎, {username}</span>
          <button onClick={onLogout} className={styles.logoutButton}>
            退出
          </button>
        </div>
      </div>
      <div className={styles.grid}>
        {industries.map((industry, index) => (
          <div 
            key={index} 
            className={styles.card}
            onClick={() => handleIndustryClick(industry.title)}
          >
            <div className={styles.icon}>{industry.icon}</div>
            <h2 className={styles.cardTitle}>{industry.title}</h2>
            <p className={styles.description}>{industry.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndustrySelection; 