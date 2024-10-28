pipeline {
    agent {
        docker { 
            image "xxxxxxx/dotnet:latest"  // Замените на ваш Docker-образ с .NET
            registryUrl 'xxxxxxx'          // URL вашего Docker Registry
            registryCredentialsId "docker-cred" // Учетные данные для Docker Registry
            reuseNode true
        }
    }
    
    environment {
        DOCKER_IMAGE = 'your-dockerhub-username/hello-world-app' // Имя вашего Docker-образа для Express-приложения
        DOCKER_TAG = "latest" // Тег Docker-образа (можно заменить на версию)
    }

    stages {
        stage('Dotnet Test') {
            steps {
                // Проверяем установленную версию .NET в образе
                sh 'dotnet --version'
            }
        }

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
                // Запускаем контейнер для тестирования приложения
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
