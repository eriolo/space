import s from './Skeleton.module.css'

type SkeletonProps = {
  style?: React.CSSProperties
}

const Skeleton = ({ style }: SkeletonProps) => <div className={s.container} style={style} />

export default Skeleton
