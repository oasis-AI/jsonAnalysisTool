class JSONToolbox {
    constructor() {
        this.currentTool = 'formatter';
        this.isDarkTheme = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initTheme();
        this.showTool('formatter');
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.target.closest('.nav-btn').dataset.tool;
                if (tool) {
                    this.showTool(tool);
                    this.updateActiveNav(e.target.closest('.nav-btn'));
                }
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Fullscreen toggle
        document.getElementById('fullscreenBtn').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // JSON Formatter
        document.getElementById('formatBtn').addEventListener('click', () => {
            this.formatJSON();
        });
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearFormatter();
        });
        document.getElementById('copyBtn').addEventListener('click', () => {
            this.copyToClipboard('jsonOutput');
        });
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadJSON();
        });

        // JSON Validator
        document.getElementById('validateBtn').addEventListener('click', () => {
            this.validateJSON();
        });
        document.getElementById('clearValidatorBtn').addEventListener('click', () => {
            this.clearValidator();
        });

        // JSON Minifier
        document.getElementById('minifyBtn').addEventListener('click', () => {
            this.minifyJSON();
        });
        document.getElementById('clearMinifyBtn').addEventListener('click', () => {
            this.clearMinifier();
        });
        document.getElementById('copyMinifyBtn').addEventListener('click', () => {
            this.copyToClipboard('minifyOutput');
        });

        // JSON Compare
        document.getElementById('compareBtn').addEventListener('click', () => {
            this.compareJSON();
        });
        document.getElementById('clearCompareBtn').addEventListener('click', () => {
            this.clearCompare();
        });

        // Base64
        document.getElementById('encodeBtn').addEventListener('click', () => {
            this.encodeBase64();
        });
        document.getElementById('decodeBtn').addEventListener('click', () => {
            this.decodeBase64();
        });
        document.getElementById('clearBase64Btn').addEventListener('click', () => {
            this.clearBase64();
        });

        // URL Encoding
        document.getElementById('urlEncodeBtn').addEventListener('click', () => {
            this.encodeURL();
        });
        document.getElementById('urlDecodeBtn').addEventListener('click', () => {
            this.decodeURL();
        });
        document.getElementById('clearUrlBtn').addEventListener('click', () => {
            this.clearURL();
        });

        // Timestamp
        document.getElementById('nowBtn').addEventListener('click', () => {
            this.setCurrentTimestamp();
        });
        document.getElementById('timestampToDateBtn').addEventListener('click', () => {
            this.timestampToDate();
        });
        document.getElementById('dateToTimestampBtn').addEventListener('click', () => {
            this.dateToTimestamp();
        });
        document.getElementById('clearTimestampBtn').addEventListener('click', () => {
            this.clearTimestamp();
        });

        // Input change events for stats
        document.getElementById('jsonInput').addEventListener('input', () => {
            this.updateInputStats();
        });
        document.getElementById('minifyInput').addEventListener('input', () => {
            this.updateMinifyInputStats();
        });
        document.getElementById('validateInput').addEventListener('input', () => {
            this.realTimeValidation();
        });
    }

    showTool(toolName) {
        // Hide all tools
        document.querySelectorAll('.tool-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected tool
        const toolSection = document.getElementById(toolName);
        if (toolSection) {
            toolSection.classList.add('active');
            this.currentTool = toolName;
        }
    }

    updateActiveNav(activeBtn) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.isDarkTheme = true;
            document.documentElement.setAttribute('data-theme', 'dark');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        if (this.isDarkTheme) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            document.getElementById('fullscreenBtn').innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            document.getElementById('fullscreenBtn').innerHTML = '<i class="fas fa-expand"></i>';
        }
    }

    // JSON Formatter
    formatJSON() {
        const input = document.getElementById('jsonInput').value.trim();
        const output = document.getElementById('jsonOutput');
        const status = document.getElementById('validationStatus');

        if (!input) {
            this.showToast('请输入JSON数据', 'warning');
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2);
            
            output.innerHTML = this.highlightJSON(formatted);
            this.updateOutputStats(formatted.length);
            
            status.innerHTML = '<i class="fas fa-check-circle text-success"></i> 有效的JSON';
            
            this.showToast('JSON格式化成功', 'success');
        } catch (error) {
            output.innerHTML = `<div class="validation-error">
                <i class="fas fa-exclamation-triangle"></i> JSON格式错误
                <div class="error-detail">${error.message}</div>
            </div>`;
            
            status.innerHTML = '<i class="fas fa-times-circle text-error"></i> 无效的JSON';
            this.updateOutputStats(0);
            
            this.showToast('JSON格式错误', 'error');
        }
    }

    highlightJSON(json) {
        return json
            .replace(/("([^"\\]|\\.)*")\s*:/g, '<span class="json-key">$1</span>:')
            .replace(/:\s*("([^"\\]|\\.)*")/g, ': <span class="json-string">$1</span>')
            .replace(/:\s*(\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
            .replace(/:\s*(true|false)/g, ': <span class="json-boolean">$1</span>')
            .replace(/:\s*(null)/g, ': <span class="json-null">$1</span>')
            .replace(/([{}[\],])/g, '<span class="json-punctuation">$1</span>');
    }

    clearFormatter() {
        document.getElementById('jsonInput').value = '';
        document.getElementById('jsonOutput').innerHTML = '';
        document.getElementById('validationStatus').innerHTML = '<i class="fas fa-circle text-gray"></i> 待验证';
        this.updateInputStats();
        this.updateOutputStats(0);
    }

    copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        let text = '';
        
        if (element.tagName === 'TEXTAREA') {
            text = element.value;
        } else {
            text = element.textContent || element.innerText;
        }

        if (!text.trim()) {
            this.showToast('没有内容可复制', 'warning');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            this.showToast('已复制到剪贴板', 'success');
        }).catch(() => {
            this.showToast('复制失败', 'error');
        });
    }

    downloadJSON() {
        const output = document.getElementById('jsonOutput');
        const text = output.textContent || output.innerText;

        if (!text.trim()) {
            this.showToast('没有内容可下载', 'warning');
            return;
        }

        const blob = new Blob([text], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.json';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('文件下载成功', 'success');
    }

    updateInputStats() {
        const input = document.getElementById('jsonInput').value;
        document.getElementById('inputStats').textContent = `字符: ${input.length}`;
    }

    updateOutputStats(length) {
        document.getElementById('outputStats').textContent = `字符: ${length}`;
    }

    // JSON Validator
    validateJSON() {
        const input = document.getElementById('validateInput').value.trim();
        const result = document.getElementById('validationResult');

        if (!input) {
            result.innerHTML = `
                <div class="result-placeholder">
                    <i class="fas fa-search"></i>
                    <p>请输入JSON数据进行验证</p>
                </div>
            `;
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const size = new Blob([input]).size;
            const keys = this.countJSONKeys(parsed);
            
            result.innerHTML = `
                <div class="validation-success">
                    <h3><i class="fas fa-check-circle"></i> JSON验证通过</h3>
                    <div style="margin-top: 1rem;">
                        <p><strong>文件大小:</strong> ${this.formatBytes(size)}</p>
                        <p><strong>键数量:</strong> ${keys}</p>
                        <p><strong>数据类型:</strong> ${this.getJSONType(parsed)}</p>
                        <p><strong>格式:</strong> 有效的JSON格式</p>
                    </div>
                </div>
            `;
        } catch (error) {
            result.innerHTML = `
                <div class="validation-error">
                    <h3><i class="fas fa-times-circle"></i> JSON验证失败</h3>
                    <div class="error-detail" style="margin-top: 1rem;">
                        <strong>错误信息:</strong><br>
                        ${error.message}
                        <br><br>
                        <strong>错误位置:</strong><br>
                        ${this.getErrorPosition(input, error)}
                    </div>
                </div>
            `;
        }
    }

    realTimeValidation() {
        // 实时验证的简化版本
        const input = document.getElementById('validateInput').value.trim();
        if (input && input.length > 10) {
            setTimeout(() => this.validateJSON(), 500);
        }
    }

    clearValidator() {
        document.getElementById('validateInput').value = '';
        document.getElementById('validationResult').innerHTML = `
            <div class="result-placeholder">
                <i class="fas fa-search"></i>
                <p>请输入JSON数据进行验证</p>
            </div>
        `;
    }

    countJSONKeys(obj, count = 0) {
        if (typeof obj === 'object' && obj !== null) {
            if (Array.isArray(obj)) {
                obj.forEach(item => count = this.countJSONKeys(item, count));
            } else {
                count += Object.keys(obj).length;
                Object.values(obj).forEach(value => count = this.countJSONKeys(value, count));
            }
        }
        return count;
    }

    getJSONType(obj) {
        if (Array.isArray(obj)) return 'Array';
        if (typeof obj === 'object' && obj !== null) return 'Object';
        if (typeof obj === 'string') return 'String';
        if (typeof obj === 'number') return 'Number';
        if (typeof obj === 'boolean') return 'Boolean';
        if (obj === null) return 'Null';
        return 'Unknown';
    }

    getErrorPosition(input, error) {
        const lines = input.split('\n');
        const errorMsg = error.message;
        
        // 尝试从错误消息中提取位置信息
        const positionMatch = errorMsg.match(/position (\d+)/i);
        if (positionMatch) {
            const position = parseInt(positionMatch[1]);
            let currentPos = 0;
            for (let i = 0; i < lines.length; i++) {
                if (currentPos + lines[i].length >= position) {
                    return `第 ${i + 1} 行，第 ${position - currentPos + 1} 个字符`;
                }
                currentPos += lines[i].length + 1;
            }
        }
        
        return '无法确定具体位置';
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // JSON Minifier
    minifyJSON() {
        const input = document.getElementById('minifyInput').value.trim();
        const output = document.getElementById('minifyOutput');

        if (!input) {
            this.showToast('请输入JSON数据', 'warning');
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            
            output.textContent = minified;
            this.updateMinifyOutputStats(minified.length);
            this.updateCompressionRatio(input.length, minified.length);
            
            this.showToast('JSON压缩成功', 'success');
        } catch (error) {
            output.innerHTML = `<div class="validation-error">
                <i class="fas fa-exclamation-triangle"></i> JSON格式错误<br>
                ${error.message}
            </div>`;
            this.updateMinifyOutputStats(0);
            
            this.showToast('JSON格式错误', 'error');
        }
    }

    updateMinifyInputStats() {
        const input = document.getElementById('minifyInput').value;
        document.getElementById('minifyInputStats').textContent = `字符: ${input.length}`;
    }

    updateMinifyOutputStats(length) {
        document.getElementById('minifyOutputStats').textContent = `字符: ${length}`;
    }

    updateCompressionRatio(originalLength, compressedLength) {
        if (originalLength === 0) {
            document.getElementById('compressionRatio').textContent = '压缩率: 0%';
            return;
        }
        
        const ratio = ((originalLength - compressedLength) / originalLength * 100).toFixed(1);
        document.getElementById('compressionRatio').textContent = `压缩率: ${ratio}%`;
    }

    clearMinifier() {
        document.getElementById('minifyInput').value = '';
        document.getElementById('minifyOutput').textContent = '';
        this.updateMinifyInputStats();
        this.updateMinifyOutputStats(0);
        document.getElementById('compressionRatio').textContent = '压缩率: 0%';
    }

    // JSON Compare
    compareJSON() {
        const inputA = document.getElementById('compareInputA').value.trim();
        const inputB = document.getElementById('compareInputB').value.trim();
        const result = document.getElementById('compareResult');

        if (!inputA || !inputB) {
            this.showToast('请输入两个JSON进行对比', 'warning');
            return;
        }

        try {
            const jsonA = JSON.parse(inputA);
            const jsonB = JSON.parse(inputB);
            
            const differences = this.deepCompare(jsonA, jsonB);
            
            if (differences.length === 0) {
                result.innerHTML = `
                    <div class="validation-success">
                        <h3><i class="fas fa-check-circle"></i> JSON完全相同</h3>
                        <p>两个JSON对象没有任何差异</p>
                    </div>
                `;
            } else {
                result.innerHTML = `
                    <div class="validation-error">
                        <h3><i class="fas fa-exclamation-triangle"></i> 发现 ${differences.length} 处差异</h3>
                        <div class="diff-container">
                            ${differences.map(diff => `
                                <div class="diff-line ${diff.type}">
                                    <strong>${diff.path}:</strong> ${diff.message}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            result.innerHTML = `
                <div class="validation-error">
                    <h3><i class="fas fa-times-circle"></i> JSON格式错误</h3>
                    <div class="error-detail">${error.message}</div>
                </div>
            `;
        }
    }

    deepCompare(obj1, obj2, path = '') {
        const differences = [];
        
        if (typeof obj1 !== typeof obj2) {
            differences.push({
                type: 'diff-removed',
                path: path || 'root',
                message: `类型不同: ${typeof obj1} vs ${typeof obj2}`
            });
            return differences;
        }

        if (obj1 === null || obj2 === null) {
            if (obj1 !== obj2) {
                differences.push({
                    type: 'diff-removed',
                    path: path || 'root',
                    message: `值不同: ${obj1} vs ${obj2}`
                });
            }
            return differences;
        }

        if (typeof obj1 !== 'object') {
            if (obj1 !== obj2) {
                differences.push({
                    type: 'diff-removed',
                    path: path || 'root',
                    message: `值不同: ${obj1} vs ${obj2}`
                });
            }
            return differences;
        }

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        const allKeys = new Set([...keys1, ...keys2]);

        allKeys.forEach(key => {
            const newPath = path ? `${path}.${key}` : key;
            
            if (!(key in obj1)) {
                differences.push({
                    type: 'diff-added',
                    path: newPath,
                    message: `JSON B中新增的键`
                });
            } else if (!(key in obj2)) {
                differences.push({
                    type: 'diff-removed',
                    path: newPath,
                    message: `JSON A中独有的键`
                });
            } else {
                differences.push(...this.deepCompare(obj1[key], obj2[key], newPath));
            }
        });

        return differences;
    }

    clearCompare() {
        document.getElementById('compareInputA').value = '';
        document.getElementById('compareInputB').value = '';
        document.getElementById('compareResult').innerHTML = `
            <div class="result-placeholder">
                <i class="fas fa-balance-scale"></i>
                <p>请输入两个JSON进行对比</p>
            </div>
        `;
    }

    // Base64
    encodeBase64() {
        const input = document.getElementById('base64Input').value;
        const output = document.getElementById('base64Output');

        if (!input) {
            this.showToast('请输入要编码的文本', 'warning');
            return;
        }

        try {
            const encoded = btoa(unescape(encodeURIComponent(input)));
            output.value = encoded;
            this.showToast('Base64编码成功', 'success');
        } catch (error) {
            this.showToast('编码失败', 'error');
        }
    }

    decodeBase64() {
        const input = document.getElementById('base64Input').value;
        const output = document.getElementById('base64Output');

        if (!input) {
            this.showToast('请输入要解码的Base64文本', 'warning');
            return;
        }

        try {
            const decoded = decodeURIComponent(escape(atob(input)));
            output.value = decoded;
            this.showToast('Base64解码成功', 'success');
        } catch (error) {
            this.showToast('解码失败，请检查Base64格式', 'error');
        }
    }

    clearBase64() {
        document.getElementById('base64Input').value = '';
        document.getElementById('base64Output').value = '';
    }

    // URL Encoding
    encodeURL() {
        const input = document.getElementById('urlInput').value;
        const output = document.getElementById('urlOutput');

        if (!input) {
            this.showToast('请输入要编码的URL', 'warning');
            return;
        }

        const encoded = encodeURIComponent(input);
        output.value = encoded;
        this.showToast('URL编码成功', 'success');
    }

    decodeURL() {
        const input = document.getElementById('urlInput').value;
        const output = document.getElementById('urlOutput');

        if (!input) {
            this.showToast('请输入要解码的URL', 'warning');
            return;
        }

        try {
            const decoded = decodeURIComponent(input);
            output.value = decoded;
            this.showToast('URL解码成功', 'success');
        } catch (error) {
            this.showToast('解码失败，请检查URL格式', 'error');
        }
    }

    clearURL() {
        document.getElementById('urlInput').value = '';
        document.getElementById('urlOutput').value = '';
    }

    // Timestamp
    setCurrentTimestamp() {
        const now = Math.floor(Date.now() / 1000);
        document.getElementById('timestampInput').value = now;
        this.timestampToDate();
    }

    timestampToDate() {
        const timestamp = document.getElementById('timestampInput').value;
        const result = document.getElementById('timestampResult');

        if (!timestamp) {
            result.innerHTML = '';
            return;
        }

        try {
            let ts = parseInt(timestamp);
            
            // 判断是秒还是毫秒
            if (ts.toString().length === 10) {
                ts *= 1000; // 转换为毫秒
            }

            const date = new Date(ts);
            
            if (isNaN(date.getTime())) {
                result.innerHTML = '<span class="validation-error">无效的时间戳</span>';
                return;
            }

            result.innerHTML = `
                <div>
                    <strong>本地时间:</strong><br>
                    ${date.toLocaleString('zh-CN')}<br><br>
                    <strong>UTC时间:</strong><br>
                    ${date.toUTCString()}<br><br>
                    <strong>ISO格式:</strong><br>
                    ${date.toISOString()}
                </div>
            `;
        } catch (error) {
            result.innerHTML = '<span class="validation-error">转换失败</span>';
        }
    }

    dateToTimestamp() {
        const dateInput = document.getElementById('dateInput').value;
        const result = document.getElementById('dateResult');

        if (!dateInput) {
            result.innerHTML = '';
            return;
        }

        try {
            const date = new Date(dateInput);
            const timestamp = Math.floor(date.getTime() / 1000);
            const timestampMs = date.getTime();

            result.innerHTML = `
                <div>
                    <strong>秒级时间戳:</strong><br>
                    ${timestamp}<br><br>
                    <strong>毫秒级时间戳:</strong><br>
                    ${timestampMs}<br><br>
                    <strong>日期时间:</strong><br>
                    ${date.toLocaleString('zh-CN')}
                </div>
            `;
        } catch (error) {
            result.innerHTML = '<span class="validation-error">转换失败</span>';
        }
    }

    clearTimestamp() {
        document.getElementById('timestampInput').value = '';
        document.getElementById('dateInput').value = '';
        document.getElementById('timestampResult').innerHTML = '';
        document.getElementById('dateResult').innerHTML = '';
    }

    // Toast notifications
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                ${message}
            </div>
        `;

        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Hide toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new JSONToolbox();
});
