import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import nProgress from 'nprogress'

// 消息提示框
export function toast(message, type='success', dangerouslyUseHTMLString=true) {
    ElNotification({
        message,
        type,
        dangerouslyUseHTMLString,
        duration: 3000
    })
}

// 弹出确定框
export function showModal(content='您确定吗', type='warning', title='') {
    return ElMessageBox.confirm(
        content,
        title,
        {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type,
        }
    )
}

// 显示全屏进度条
export function showFullLoading() {
    nProgress.start()
}

//隐藏全屏进度条
export function hideFullLoading() {
    nProgress.done()
}

// 弹出输入框
export function showPrompt(tip, value='') {
    return  ElMessageBox.prompt(tip, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue: value
  })
}