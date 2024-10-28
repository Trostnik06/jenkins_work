pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'your-dockerhub-username/hello-world-app' // Замените на имя Docker-образа
        DOCKER_TAG = "latest" // Тег образа (можно использовать версию или "latest")
    }

    stages {
        stage('Build Docker Image') {
            steps {
                // Сборка Docker-образа приложения
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Test Application') {
            steps {
                // Запускаем контейнер для тестирования
                script {
                    docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").withRun('-p 3000:3000') { container ->
                        // Выполняем тест с ожиданием доступности приложения
                        sh "sleep 5"  // Даем контейнеру время для запуска
                        sh "curl -f http://localhost:3000" // Проверяем доступность сервера на 200 и текст ответа
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            when {
                expression {
                    // Загружаем образ только если предыдущие шаги были успешными
                    currentBuild.result == null || currentBuild.result == 'SUCCESS'
                }
            }
            steps {
                // Аутентификация в Docker Hub и загрузка образа
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                    }
                }
            }
        }
    }

    post {
        always {
            // Очищаем образы Docker после завершения конвейера
            sh "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true"
        }
    }
}
