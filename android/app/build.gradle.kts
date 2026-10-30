plugins {
    id("com.android.application")
}

android {
    namespace = "org.zallyx62.impact"
    compileSdk = 36

    defaultConfig {
        applicationId = "org.zallyx62.impact"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "0.1.0"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }
}

dependencies {
    implementation("androidx.core:core:1.16.0")
    implementation("androidx.webkit:webkit:1.18.0")
}
