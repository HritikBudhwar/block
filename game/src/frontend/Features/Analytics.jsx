
import React from 'react';
import './Analytics.css';

const Analytics = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '8',
      change: '12% increase',
      icon: '👥',
    },
    {
      title: 'Total Badges',
      value: '6',
      change: '2% increase',
      icon: '🏆',
    },
    {
      title: 'Badges Granted',
      value: '12',
      change: '8% increase',
      icon: '🎯',

    },
    {
      title: 'Badge Growth',
      value: '24',
      change: '18% increase',
      icon: '📈',
    
    }
  ];

  const recentActivity = [
    {
      type: 'Badge Granted',
      description: 'Academic Excellence badge granted to Emma Thompson',
      time: '1 year ago',
      user: 'Professor Anderson'
    },
    {
      type: 'Badge Granted',
      description: 'Leadership badge granted to Sophia Garcia',
      time: '1 year ago',
      user: 'Dean Davis'
    },
    {
      type: 'New Badge Created',
      description: 'Sports Achievement badge created',
      time: '1 year ago',
      user: 'Admin User'
    },
    {
      type: 'Badge Granted',
      description: 'Innovation badge granted to Noah Davis',
      time: '1 year ago',
      user: 'Professor Wilson'
    },
    {
      type: 'Badge Granted',
      description: 'Perfect Attendance badge granted to Olivia Brown',
      time: '1 year ago',
      user: 'Professor Taylor'
    }
  ];

  const badgeDistribution = [
    { name: 'Academic Excellence', count: 3, percentage: 25 },
    { name: 'Leadership', count: 2, percentage: 17 },
    { name: 'Innovation', count: 2, percentage: 17 },
    { name: 'Community Service', count: 2, percentage: 17 },
    { name: 'Perfect Attendance', count: 2, percentage: 17 },
    { name: 'Sports Achievement', count: 1, percentage: 8 }
  ];

  return (
    <div className='hello'>
    <div className="analytics-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Manage student badges and track progress</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon">{stat.icon}</div>
            </div>
            <h3 className="stat-title">{stat.title}</h3>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-change">
              <span className="stat-change-icon">↗</span>
              {stat.change}
            </div>
            <p className="stat-comparison">Compared to last month</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="main-content">
        {/* Recent Activity */}
        <div className="activity-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-header">
                  <div>
                    <h3 className="activity-type">{activity.type}</h3>
                    <p className="activity-description">{activity.description}</p>
                  </div>
                  <div className="activity-time">
                    <p>{activity.time}</p>
                    <p className="activity-user">{activity.user}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badge Distribution */}
        <div className="distribution-section">
          <h2 className="section-title">Badge Distribution</h2>
          <div className="badge-list">
            {badgeDistribution.map((badge, index) => (
              <div key={index} className="badge-item">
                <div className="badge-header">
                  <span className="badge-name">{badge.name}</span>
                  <span className="badge-stats">{badge.count} ({badge.percentage}%)</span>
                </div>
                <div className="progress-bar"></div>
              </div>
            ))}
          </div>
        </div>
      </div>-
    </div>
    </div>
  );
};

export default Analytics;