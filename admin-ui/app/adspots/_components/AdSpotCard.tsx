'use client';
import { useState } from 'react';
import { AdSpot, Status } from '@/lib/types';
import { deactivateAdSpot } from '@/lib/api-client';
import { isAdSpotEligible, formatDateTime } from '@/lib/date-utils';
import { useToast } from '@/hooks/useToast';
import { useSWRConfig } from 'swr';
import Image from 'next/image';
import { Card, CardBody, CardFooter, Chip, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { MapPin, Calendar, Clock, AlertTriangle } from 'lucide-react';

type Props = {
  adSpot: AdSpot;
};

export default function AdSpotCard({ adSpot }: Props) {
  const { mutate } = useSWRConfig();
  const { showToast } = useToast();
  const [isDeactivating, setIsDeactivating] = useState(false);
  const isEligible = isAdSpotEligible(adSpot);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDeactivate = async () => {
    setIsDeactivating(true);

    try {
      await deactivateAdSpot(adSpot.id);
      showToast('AdSpot desactivado exitosamente', 'success');

      // Invalidar todos los cache keys relacionados con adspots
      mutate((key) => Array.isArray(key) && key[0] === 'adspots');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Error al desactivar',
        'error'
      );
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <Card className="overflow-hidden bg-card border-border hover:border-primary/70 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 shadow-lg group rounded-2xl">
      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={adSpot.imageUrl}
          alt={adSpot.title}
          fill
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div
          style={{ background: 'var(--gradient-primary)' }}
          className="absolute top-4 right-4 text-white shadow-lg shadow-primary/50 font-semibold uppercase text-xs rounded-full px-3 py-1"
        >
          {adSpot.status}
        </div>
        {!isEligible && adSpot.status === Status.ACTIVE && (
          <Chip
            className="absolute top-4 left-4 bg-destructive text-destructive-foreground shadow-lg font-semibold uppercase text-xs rounded-full px-3"
            size="sm"
          >
            Expirado
          </Chip>
        )}
      </div>

      {/* Content */}
      <CardBody className="p-6 space-y-5">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2.5 group-hover:text-primary transition-colors duration-300 font-[family-name:var(--font-display)] leading-tight">
            {adSpot.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="font-mono text-xs uppercase tracking-wide">{adSpot.placement.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground pt-4 border-t border-border">
            <Calendar className="h-4 w-4" />
            <span>{formatDateTime(adSpot.createdAt)}</span>
          </div>
          {adSpot.ttlMinutes && (
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>TTL: {adSpot.ttlMinutes} minutos</span>
            </div>
          )}
        </div>
      </CardBody>

      {/* Footer */}
      {adSpot.status === Status.ACTIVE && (
        <CardFooter className="px-6 pb-6 pt-0">
          <Button
            color="danger"
            variant="flat"
            size="md"
            className="w-full font-semibold rounded-full h-11 hover:shadow-lg hover:shadow-destructive/30 transition-all duration-300 bg-destructive/10 hover:bg-destructive/20 text-destructive"
            onClick={onOpen}
            isDisabled={isDeactivating}
          >
            Desactivar
          </Button>
        </CardFooter>
      )}

      {/* Modal de confirmación */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          base: 'bg-card border border-border',
          header: 'border-b border-border',
          body: 'py-6',
          footer: 'border-t border-border'
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-3 items-center text-foreground">
                <div className="rounded-full bg-destructive/10 p-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <span className="font-bold">Confirmar desactivación</span>
              </ModalHeader>
              <ModalBody>
                <p className="text-muted-foreground">
                  ¿Estás seguro de que deseas desactivar el AdSpot{' '}
                  <span className="font-semibold text-foreground">"{adSpot.title}"</span>?
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Esta acción no se puede deshacer.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="bordered"
                  onPress={onClose}
                  className="border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors font-semibold rounded-full"
                >
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    handleDeactivate();
                    onClose();
                  }}
                  isLoading={isDeactivating}
                  className="bg-destructive hover:bg-destructive/90 text-white font-semibold rounded-full shadow-lg hover:shadow-destructive/30 transition-shadow"
                >
                  {isDeactivating ? 'Desactivando...' : 'Desactivar AdSpot'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
}
