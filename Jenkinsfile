pipeline {
    agent any
    
    tools {
        nodejs "NodeJS 20"
    }
    environment {
        
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/DuyNamjs08/nodejs-mico-service'
            }
        }
        
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Lint') {
            steps {
                sh 'npm run lint' 
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    sh 'git push origin master'
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            emailext body: 'Build failed: ${BUILD_URL}', subject: 'Build Failed', to: 'team@example.com'
        }
    }
}