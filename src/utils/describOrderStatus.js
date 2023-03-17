import { EOrderStatus } from '../enums/EOrderStatus.js'

export const getDescription = (status, userRole) => {
  let description = ''
  switch (status) {
    case EOrderStatus.ACCEPTED:
      description = `${userRole} accepted to deliver product.`
      break

    case EOrderStatus.DECLINED:
      description = `${userRole} declined to deliver product.`
      break

    case EOrderStatus.CANCELLED:
      description = `${userRole} cancelled order.`
      break

    case EOrderStatus.DELIVERED:
      description = `${userRole} delivered product.`
      break

    case EOrderStatus.RETURNED:
      description = `${userRole} rejected and returned the product.`
      break

    default:
      break
  }

  return description
}
