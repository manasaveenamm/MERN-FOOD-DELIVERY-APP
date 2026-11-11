
pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "food-backend:ci-${BUILD_NUMBER}"
        FRONTEND_IMAGE = "food-frontend:ci-${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Source code checked out successfully'
            }
        }

        stage('Validate Project') {
            steps {
                sh '''
                    test -f backend/Dockerfile
                    test -f frontend/Dockerfile
                    test -f frontend/nginx.conf
                    echo "Project files validated"
                '''
            }
        }

        stage('Build Backend') {
            steps {
                sh '''
                    docker build \
                      -t ${BACKEND_IMAGE} \
                      -f backend/Dockerfile backend
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                    docker build \
                      -t ${FRONTEND_IMAGE} \
                      -f frontend/Dockerfile frontend
                '''
            }
        }
        
        stage('Deploy to Coolify') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'coolify-api-token',
                        variable: 'COOLIFY_TOKEN'
                    )
                ]) {
                    sh '''
                        set +x

                        curl --fail-with-body \
                          --silent \
                          --show-error \
                          --request POST \
                          "http://127.0.0.1:8000/api/v1/deploy?uuid=ky5no7fpjzifoqmhypuvf59h" \
                          --header "Authorization: Bearer $COOLIFY_TOKEN" \
                          --header "Accept: application/json"
                    '''
                }
            }
        }

    }

    post {
        success {
            echo 'CI Pipeline completed successfully!'
        }
        failure {
            echo 'CI Pipeline failed. Check the build logs.'
        }
    }
}
