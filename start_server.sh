#!/bin/bash

echo "=== JSON工具网站服务器启动脚本 ==="
echo "正在检查系统环境..."

# 检查Python版本
if command -v python3 &> /dev/null; then
    echo "✓ 发现 Python3: $(python3 --version)"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    echo "✓ 发现 Python: $(python --version)"
    PYTHON_CMD="python"
else
    echo "✗ 未找到Python，无法启动HTTP服务器"
    exit 1
fi

# 检查端口是否被占用
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口8080已被占用，尝试终止..."
    lsof -ti:8080 | xargs kill -9 2>/dev/null
    sleep 2
fi

echo "启动HTTP服务器..."
echo "📍 服务地址："
echo "   - http://localhost:8080"
echo "   - http://127.0.0.1:8080"
echo ""
echo "🌐 在浏览器中访问上述任意地址"
echo "⏹️  按 Ctrl+C 停止服务器"
echo "===========================================" 

# 启动服务器并显示详细信息
if [ "$PYTHON_CMD" = "python3" ]; then
    python3 -m http.server 8080 --bind 127.0.0.1
else
    python -m SimpleHTTPServer 8080
fi
