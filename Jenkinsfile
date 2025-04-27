pipeline {
    agent any

    environment {
        GIT_REPO = 'https://github.com/Abdelrahman1427/STS_UI.git'
        BRANCH = 'main'
        REMOTE_DIR = '/' // Directory on the remote machine
    }

    stages {
        stage('Pull App from Git') {
            steps {
                script {
                    git branch: BRANCH, url: GIT_REPO
                }
            }
        }

        stage('Install Dependencies and Build') {
            steps {
                script {
                    sh 'npm install'
                    sh 'ng build '
                }
            }
        }

        stage('Publish Angular App') {
            steps {
                script {
                    sh 'ls -l dist/' 
                }
            }
        }

        stage('Push Files to Local Machine') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'Remote_machine', usernameVariable: 'REMOTE_USER', passwordVariable: 'REMOTE_PASS'),
                                     string(credentialsId: 'Remote_Host_IP', variable: 'REMOTE_HOST')]) {
                        // Push files to the local machine using SSH and SCP
                        sh """
                            sshpass -p '${REMOTE_PASS}' scp -r dist/* ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
