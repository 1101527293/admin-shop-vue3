import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import nProgress from 'nprogress'

// 消息提示框
export function toast(message, type='success', dangerouslyUseHTMLString=false) {
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
    // .then(() => {
    //   ElMessage({
    //     type: 'success',
    //     message: '操作成功',
    //   })
    // })
    // .catch(() => {
    //   ElMessage({
    //     type: 'info',
    //     message: '操作失败',
    //   })
    // })
}

// 显示全屏进度条
export function showFullLoading() {
    nProgress.start()
}

//隐藏全屏进度条
export function hideFullLoading() {
    nProgress.done()
}