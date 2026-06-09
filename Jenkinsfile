pipeline {
  agent any

  environment {
    APP_NAME = 'dailyops'
    ACR_LOGIN_SERVER = 'dailyopslearning5kd5hr.azurecr.io'
    DOCKER_IMAGE = "${ACR_LOGIN_SERVER}/dailyops"
    IMAGE_TAG = "${BUILD_NUMBER}"
    KUBECONFIG = 'C:\\Users\\iquya\\.kube\\config'
  }

  stages {
    stage('Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        bat 'npm ci'
      }
    }

    stage('Run Tests') {
      steps {
        bat 'npm test'
      }
    }

    stage('Build Docker Image') {
      steps {
        bat 'docker build -t %DOCKER_IMAGE%:%IMAGE_TAG% .'
      }
    }

    stage('Push Image to Azure ACR') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'azure-acr-creds', usernameVariable: 'ACR_CLIENT_ID', passwordVariable: 'ACR_CLIENT_SECRET')]) {
          bat 'docker login %ACR_LOGIN_SERVER% -u "%ACR_CLIENT_ID%" -p "%ACR_CLIENT_SECRET%"'
          bat 'docker push %DOCKER_IMAGE%:%IMAGE_TAG%'
        }
      }
    }

    stage('Deploy to Azure AKS') {
      steps {
        bat 'helm upgrade --install dailyops ./helm/dailyops --set image.repository=%DOCKER_IMAGE% --set image.tag=%IMAGE_TAG% --set service.type=LoadBalancer --set serviceMonitor.enabled=false'
        bat 'kubectl rollout status deployment/dailyops --timeout=180s'
      }
    }
  }
}
