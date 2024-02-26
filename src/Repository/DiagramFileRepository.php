<?php

namespace App\Repository;

use App\Entity\DiagramFile;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<DiagramFile>
 *
 * @method DiagramFile|null find($id, $lockMode = null, $lockVersion = null)
 * @method DiagramFile|null findOneBy(array $criteria, array $orderBy = null)
 * @method DiagramFile[]    findAll()
 * @method DiagramFile[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DiagramFileRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DiagramFile::class);
    }

    //    /**
    //     * @return DiagramFile[] Returns an array of DiagramFile objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('d')
    //            ->andWhere('d.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('d.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?DiagramFile
    //    {
    //        return $this->createQueryBuilder('d')
    //            ->andWhere('d.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
