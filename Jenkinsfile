pipeline {
  agent any

  environment {
    APP_NAME = 'dailyops'
    DOCKER_IMAGE = 'your-dockerhub-username/dailyops'
    IMAGE_TAG = "${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'npm test'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} .'
      }
    }

    stage('Push Docker Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
          sh 'docker push ${DOCKER_IMAGE}:${IMAGE_TAG}'
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh 'helm upgrade --install dailyops ./helm/dailyops --set image.repository=${DOCKER_IMAGE} --set image.tag=${IMAGE_TAG}'
      }
    }
  }
}
