'use strict';

exports.handler = (event, context, callback) => {
    const response = event.Records[0].cf.response;
    const headers = response.headers;

    // Strict-Transport-Security - HTTPS強制
    headers['strict-transport-security'] = [{
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubdomains; preload'
    }];
    
    // Content-Security-Policy - XSS攻撃防止
    headers['content-security-policy'] = [{
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.auth0.com https://*.auth0.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.auth0.com https://api.local.dev https://d20rzkwelg7jzp.cloudfront.net wss://*.auth0.com; frame-src 'self' https://*.auth0.com; object-src 'none'; media-src 'self'; worker-src 'self' blob:;"
    }];
    
    // X-Content-Type-Options - MIMEタイプスニッフィング防止
    headers['x-content-type-options'] = [{
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    }];
    
    // X-Frame-Options - クリックジャッキング防止
    headers['x-frame-options'] = [{
        key: 'X-Frame-Options',
        value: 'DENY'
    }];
    
    // X-XSS-Protection - XSS攻撃防止（レガシーブラウザ向け）
    headers['x-xss-protection'] = [{
        key: 'X-XSS-Protection',
        value: '1; mode=block'
    }];
    
    // Referrer-Policy - リファラー情報の制御
    headers['referrer-policy'] = [{
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
    }];
    
    // Permissions-Policy - ブラウザ機能の制御
    headers['permissions-policy'] = [{
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    }];
    
    callback(null, response);
}; 