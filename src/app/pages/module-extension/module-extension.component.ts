import { Component, OnInit } from '@angular/core';
import { ModuleExtensionService } from '../../services/backend/module-extension.service';

@Component({
  selector: 'app-module-extension',
  templateUrl: './module-extension.component.html',
  styleUrl: './module-extension.component.scss'
})
export class ModuleExtensionComponent implements OnInit {
  activeTab = 'custom-source'; // Default tab
  content: { heading: string, title: string, data: any[] } = { heading: '', title: '', data: [] };
  openCreateCustomModal: boolean = false;
  createCustom = {
    name: '',
    inherited_from: '',
    description: '',
    file_name: ''
  }


  // Content for different tabs
  get contentData() {
    switch (this.activeTab) {
      case 'custom-source':
        return { heading: 'Available Custom Sources', title: "Source", data: this.customSourceData };
      case 'custom-algorithm':
        return { heading: 'Available Custom Algorithms', title: "Algorithm", data: this.customAlgorithmData };
      case 'custom-sink':
        return { heading: 'Available Custom Sinks', title: "Sink", data: this.customSinkData };
      case 'custom-accumulator':
        return { heading: 'Available Custom Accumulators', title: "Accumulator", data: this.customAccumulatorData };
      default:
        return { heading: 'Available Custom Sources', title: "Source", data: this.customSourceData };
    }
  }

  customSourceData = [
    {
      title: 'Data Ingestion Hub',
      description: 'Easily define and manage various data sources for your machine learning projects. Easily define and manage various data sources for your machine learning projects. Easily define and manage various data sources for your machine learning projects.',
      labels: ['Database', 'CSV', 'Data', '+3']
    },
    {
      title: 'Real-time Stream Processor',
      description: 'Ingest and process real-time data streams from IoT devices or web applications.',
      labels: ['Stream', 'Real-time', 'Kafka', '+2']
    },
    {
      title: 'Cloud Data Connector',
      description: 'Connect and import data directly from popular cloud platforms like AWS, Azure, or GCP.',
      labels: ['AWS', 'Azure', 'GCP', '+1']
    },
    {
      title: 'Enterprise CRM Sync',
      description: 'Synchronize data from enterprise CRM systems like Salesforce and HubSpot.',
      labels: ['Salesforce', 'HubSpot', 'CRM', '+2']
    },
    {
      title: 'API Data Integrator',
      description: 'Pull in data from external APIs for enrichment or further analysis.',
      labels: ['API', 'JSON', 'REST', '+1']
    },
    {
      title: 'Enterprise CRM Sync',
      description: 'Synchronize data from enterprise CRM systems like Salesforce and HubSpot.',
      labels: ['Salesforce', 'HubSpot', 'CRM', '+2']
    },
    {
      title: 'API Data Integrator',
      description: 'Pull in data from external APIs for enrichment or further analysis.',
      labels: ['API', 'JSON', 'REST', '+1']
    },
    {
      title: 'Enterprise CRM Sync',
      description: 'Synchronize data from enterprise CRM systems like Salesforce and HubSpot.',
      labels: ['Salesforce', 'HubSpot', 'CRM', '+2']
    },
    {
      title: 'API Data Integrator',
      description: 'Pull in data from external APIs for enrichment or further analysis.',
      labels: ['API', 'JSON', 'REST', '+1']
    }

  ];

  customAlgorithmData = [
    {
      title: 'K-Means Clustering',
      description: 'Group data points into clusters for classification and analysis.',
      labels: ['Clustering', 'ML', 'Unsupervised', '+2']
    },
    {
      title: 'Linear Regression',
      description: 'Predict values based on linear relationships in your dataset.',
      labels: ['Regression', 'Prediction', 'ML', '+1']
    },
    {
      title: 'Random Forest Classifier',
      description: 'Build decision trees to classify complex data with high accuracy.',
      labels: ['Classification', 'ML', 'Trees', '+3']
    },
    {
      title: 'Principal Component Analysis (PCA)',
      description: 'Reduce the dimensionality of large datasets to improve computational efficiency.',
      labels: ['Dimensionality Reduction', 'Unsupervised', 'ML', '+2']
    },
    {
      title: 'Time Series Forecasting',
      description: 'Make future predictions based on time-sequenced data.',
      labels: ['Forecasting', 'ML', 'Time Series', '+2']
    }
  ];

  customSinkData = [
    {
      title: 'Data Lake Writer',
      description: 'Export processed data to cloud-based data lakes for long-term storage.',
      labels: ['AWS', 'Azure', 'BigQuery', '+1']
    },
    {
      title: 'SQL Database Exporter',
      description: 'Store results in relational databases like MySQL, PostgreSQL, or SQL Server.',
      labels: ['MySQL', 'PostgreSQL', 'SQL Server', '+2']
    },
    {
      title: 'Data Warehouse Loader',
      description: 'Push data into cloud-based data warehouses like Redshift, Snowflake, or BigQuery.',
      labels: ['Redshift', 'Snowflake', 'BigQuery', '+1']
    },
    {
      title: 'Data Visualization Dashboard',
      description: 'Visualize and export data to custom dashboards for real-time reporting.',
      labels: ['Tableau', 'Power BI', 'Looker', '+2']
    },
    {
      title: 'ElasticSearch Indexer',
      description: 'Index and store data in ElasticSearch for fast searching and querying.',
      labels: ['ElasticSearch', 'NoSQL', 'Indexing', '+2']
    }
  ];

  customAccumulatorData = [
    {
      title: 'Average Value Accumulator',
      description: 'Accumulates values and calculates their average over time.',
      labels: ['Average', 'Stats', 'Aggregation', '+1']
    },
    {
      title: 'Sum Aggregator',
      description: 'Calculates the total sum of numeric data in real-time.',
      labels: ['Sum', 'Aggregation', 'Numeric', '+2']
    },
    {
      title: 'Distinct Count Accumulator',
      description: 'Tracks and counts unique occurrences of data in a dataset.',
      labels: ['Distinct', 'Count', 'Unique', '+2']
    },
    {
      title: 'Max-Min Accumulator',
      description: 'Records the maximum and minimum values in a dataset for comparison.',
      labels: ['Max', 'Min', 'Numeric', '+2']
    },
    {
      title: 'Moving Average Accumulator',
      description: 'Calculates a moving average to smooth out short-term fluctuations in data.',
      labels: ['Moving Average', 'Time Series', 'Aggregation', '+1']
    }
  ];
  constructor(
    private moduleExtensionService: ModuleExtensionService
  ) {
  };
  ngOnInit(): void {
    this.ListAvailableCustomComponents()
  }
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  ListAvailableCustomComponents() {
    let params = {
      user_id: "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
      asset_type: "source",
      startIndex: 0,
      numberOfItems: 5
    }

    const response = this.moduleExtensionService.ListAvailableCustomComponents(params)
    console.log("response", response)
  }
  funcOpenCreateCustomModal() {
    this.openCreateCustomModal = true
  }
  FuncCreateCustomModalClose() {
    this.openCreateCustomModal = false
  }

}

