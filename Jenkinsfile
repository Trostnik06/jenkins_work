pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'lunarik/hello-world-app' // Укажите имя Docker-образа
        DOCKER_TAG = "latest" // Можно использовать "latest" или тег версии
    }

    stages {
        stage('Checkout') {
            steps {
                // Клонируем репозиторий
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Устанавливаем зависимости
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                // Запускаем тесты
                sh 'node test.js'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Сборка Docker-образа
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                // Аутентификация в Docker Hub и загрузка образа
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                // Развертывание Docker-контейнера
                sh '''
                docker rm -f hello-world-app || true
                docker run -d -p 3000:3000 --name hello-world-app ${DOCKER_IMAGE}:${DOCKER_TAG}
                '''
            }
        }
    }

    post {
        always {
            // Удаляем Docker-образы после завершения
            sh "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true"
        }
    }
}
