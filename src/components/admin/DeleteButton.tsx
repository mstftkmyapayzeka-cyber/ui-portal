'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'

interface DeleteButtonProps {
  id: string
  endpoint: string
  label?: string
  onSuccess?: () => void
}

export default function DeleteButton({ id, endpoint, label = 'Sil', onSuccess }: DeleteButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Bu öğeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        if (onSuccess) {
          onSuccess()
        } else {
          router.refresh()
        }
      } else {
        const data = await res.json()
        alert(data.error || 'Silme işlemi başarısız')
      }
    } catch (error) {
      alert('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="btn-danger"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4 mr-2" />
      )}
      {label}
    </button>
  )
}







