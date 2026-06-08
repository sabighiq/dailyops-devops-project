pipeline {
  agent any

  environment {
    APP_NAME = 'dailyops'
    DOCKER_IMAGE = 'iquyan/dailyops'
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

    stage('Push Docker Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          bat 'docker login -u "%DOCKER_USER%" -p "%DOCKER_PASS%"'
          bat 'docker push %DOCKER_IMAGE%:%IMAGE_TAG%'
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        bat 'helm upgrade --install dailyops ./helm/dailyops --set image.repository=%DOCKER_IMAGE% --set image.tag=%IMAGE_TAG%'
      }
    }
  }
}
